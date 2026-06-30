using System.Security.Cryptography;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using ProductCatalogAPI.DTOs.GameDtos;
using ProductCatalogAPI.Enums;
using ProductCatalogAPI.Hubs;
using ProductCatalogAPI.Models;
using ProductCatalogAPI.Repositories;
using ProductCatalogAPI.Services.Game;

namespace ProductCatalogAPI.Services;

public class GameService : IGameService
{
    private const string JoinCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
    private const int JoinCodeLength = 6;

    private readonly IGameRepository _gameRepository;
    private readonly IMapper _mapper;
    private readonly IHubContext<GameHub> _hub;

    public GameService(IGameRepository gameRepository, IMapper mapper, IHubContext<GameHub> hub)
    {
        _gameRepository = gameRepository;
        _mapper = mapper;
        _hub = hub;
    }

    public async Task<CreateGameResponseDto> CreateGameAsync(CreateGameDto dto)
    {
        var host = new Player
        {
            PlayerToken = GenerateToken(),
            Name = dto.PlayerName,
            IsHost = true
        };

        var session = new Session
        {
            JoinCode = await GenerateUniqueJoinCodeAsync(),
            BoardSize = dto.BoardSize,
            Status = GameStatus.WaitingForPlayers,
            Players = { host }
        };

        await _gameRepository.CreateAsync(session);

        return new CreateGameResponseDto
        {
            SessionId = session.Id,
            JoinCode = session.JoinCode,
            PlayerToken = host.PlayerToken
        };
    }

    public async Task<JoinGameResponseDto> JoinGameAsync(string joinCode, JoinGameDto dto)
    {
        var session = await _gameRepository.GetByJoinCodeAsync(joinCode)
            ?? throw new KeyNotFoundException($"No game found for join code '{joinCode}'.");

        if (session.Status != GameStatus.WaitingForPlayers || session.Players.Count >= 2)
            throw new ArgumentException("This game is full or has already started.");

        var player = new Player
        {
            SessionId = session.Id,
            PlayerToken = GenerateToken(),
            Name = dto.PlayerName,
            IsHost = false
        };
        session.Players.Add(player);

        // Both players present — move to the placement phase.
        session.Status = GameStatus.Placement;
        await _gameRepository.SaveChangesAsync();

        await Group(session.Id).SendAsync("PlayerJoined", new { sessionId = session.Id, playerName = player.Name });
        await Group(session.Id).SendAsync("PhaseChanged", new { status = session.Status.ToString() });

        return new JoinGameResponseDto
        {
            SessionId = session.Id,
            PlayerToken = player.PlayerToken
        };
    }

    public async Task<GameStateDto> PlaceFleetAsync(Guid sessionId, string playerToken, PlaceFleetDto dto)
    {
        var session = await _gameRepository.GetByIdAsync(sessionId)
            ?? throw new KeyNotFoundException($"Game '{sessionId}' not found.");

        var player = ResolvePlayer(session, playerToken);

        if (session.Status != GameStatus.Placement)
            throw new ArgumentException("Fleet placement is not allowed in the current game phase.");

        if (player.IsReady)
            throw new ArgumentException("You have already placed your fleet.");

        var error = BattleshipRules.ValidatePlacement(dto.Ships, session.BoardSize);
        if (error != null)
            throw new ArgumentException(error);

        player.Ships.Clear();
        foreach (var shipDto in dto.Ships)
        {
            var ship = new Ship
            {
                ShipType = shipDto.ShipType,
                Orientation = shipDto.Orientation
            };
            foreach (var c in shipDto.Cells)
                ship.Cells.Add(new Cell { X = c.X, Y = c.Y });
            player.Ships.Add(ship);
        }

        player.IsReady = true;

        // Both fleets placed — start the attack phase with the host firing first.
        if (session.Players.Count == 2 && session.Players.All(p => p.IsReady))
        {
            session.Status = GameStatus.InProgress;
            session.CurrentTurnPlayerId = session.Players.First(p => p.IsHost).Id;
        }

        await _gameRepository.SaveChangesAsync();

        if (session.Status == GameStatus.InProgress)
            await Group(session.Id).SendAsync("PhaseChanged", new
            {
                status = session.Status.ToString(),
                currentTurnPlayerId = session.CurrentTurnPlayerId
            });

        return BuildState(session, player);
    }

    public async Task<AttackResponseDto> AttackAsync(Guid sessionId, string playerToken, AttackRequestDto dto)
    {
        var session = await _gameRepository.GetByIdAsync(sessionId)
            ?? throw new KeyNotFoundException($"Game '{sessionId}' not found.");

        var attacker = ResolvePlayer(session, playerToken);

        if (session.Status != GameStatus.InProgress)
            throw new ArgumentException("The game is not in progress.");

        if (session.CurrentTurnPlayerId != attacker.Id)
            throw new ArgumentException("It is not your turn.");

        if (dto.X < 0 || dto.X >= session.BoardSize || dto.Y < 0 || dto.Y >= session.BoardSize)
            throw new ArgumentException($"Target is outside the {session.BoardSize}x{session.BoardSize} board.");

        var opponent = session.Players.First(p => p.Id != attacker.Id);

        bool alreadyFired = session.Attacks
            .Any(a => a.AttackingPlayerId == attacker.Id && a.X == dto.X && a.Y == dto.Y);
        if (alreadyFired)
            throw new ArgumentException("You have already fired at that cell.");

        var result = BattleshipRules.ResolveAttack(opponent.Ships, dto.X, dto.Y);

        session.Attacks.Add(new Attack
        {
            SessionId = session.Id,
            AttackingPlayerId = attacker.Id,
            X = dto.X,
            Y = dto.Y,
            Result = result
        });

        bool isGameOver = BattleshipRules.AllShipsSunk(opponent.Ships);
        if (isGameOver)
        {
            session.Status = GameStatus.Finished;
            session.WinnerPlayerId = attacker.Id;
        }
        else
        {
            session.CurrentTurnPlayerId = opponent.Id;
        }

        await _gameRepository.SaveChangesAsync();

        await Group(session.Id).SendAsync("AttackMade", new
        {
            attackingPlayerId = attacker.Id,
            x = dto.X,
            y = dto.Y,
            result = result.ToString(),
            currentTurnPlayerId = session.CurrentTurnPlayerId,
            isGameOver
        });

        if (isGameOver)
            await Group(session.Id).SendAsync("GameOver", new { winnerPlayerId = session.WinnerPlayerId });

        return new AttackResponseDto
        {
            Target = new CoordinateDto { X = dto.X, Y = dto.Y },
            Result = result,
            IsGameOver = isGameOver,
            WinnerPlayerId = session.WinnerPlayerId,
            CurrentTurnPlayerId = session.CurrentTurnPlayerId ?? attacker.Id
        };
    }

    public async Task<GameStateDto> GetStateAsync(Guid sessionId, string playerToken)
    {
        var session = await _gameRepository.GetByIdAsync(sessionId)
            ?? throw new KeyNotFoundException($"Game '{sessionId}' not found.");

        var player = ResolvePlayer(session, playerToken);
        return BuildState(session, player);
    }

    // ===== Helpers =====

    private GameStateDto BuildState(Session session, Player player)
    {
        var opponent = session.Players.FirstOrDefault(p => p.Id != player.Id);

        var ownBoard = new BoardViewDto
        {
            Size = session.BoardSize,
            Ships = _mapper.Map<List<ShipViewDto>>(player.Ships),
            // Shots fired at me are the opponent's attacks.
            Shots = opponent == null
                ? new List<ShotDto>()
                : _mapper.Map<List<ShotDto>>(session.Attacks.Where(a => a.AttackingPlayerId == opponent.Id))
        };

        var opponentBoard = new BoardViewDto { Size = session.BoardSize };
        if (opponent != null)
        {
            // Opponent ships are hidden until sunk.
            var sunkShips = opponent.Ships.Where(BattleshipRules.IsShipSunk);
            opponentBoard.Ships = _mapper.Map<List<ShipViewDto>>(sunkShips);
            opponentBoard.Shots = _mapper.Map<List<ShotDto>>(
                session.Attacks.Where(a => a.AttackingPlayerId == player.Id));
        }

        return new GameStateDto
        {
            SessionId = session.Id,
            Status = session.Status,
            BoardSize = session.BoardSize,
            OwnBoard = ownBoard,
            OpponentBoard = opponentBoard,
            CurrentTurnPlayerId = session.CurrentTurnPlayerId,
            YourTurn = session.CurrentTurnPlayerId == player.Id,
            WinnerPlayerId = session.WinnerPlayerId
        };
    }

    private static Player ResolvePlayer(Session session, string playerToken)
    {
        if (string.IsNullOrWhiteSpace(playerToken))
            throw new UnauthorizedAccessException("Missing player token.");

        return session.Players.FirstOrDefault(p => p.PlayerToken == playerToken)
            ?? throw new UnauthorizedAccessException("You are not a player in this game.");
    }

    private IClientProxy Group(Guid sessionId) => _hub.Clients.Group(GameHub.SessionGroup(sessionId));

    private static string GenerateToken() => Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");

    private async Task<string> GenerateUniqueJoinCodeAsync()
    {
        for (int attempt = 0; attempt < 10; attempt++)
        {
            var code = GenerateJoinCode();
            if (!await _gameRepository.JoinCodeExistsAsync(code))
                return code;
        }
        throw new InvalidOperationException("Could not generate a unique join code. Please retry.");
    }

    private static string GenerateJoinCode()
    {
        var chars = new char[JoinCodeLength];
        for (int i = 0; i < JoinCodeLength; i++)
            chars[i] = JoinCodeAlphabet[RandomNumberGenerator.GetInt32(JoinCodeAlphabet.Length)];
        return new string(chars);
    }
}
