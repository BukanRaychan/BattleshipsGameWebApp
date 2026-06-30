using Microsoft.AspNetCore.Mvc;
using ProductCatalogAPI.DTOs;
using ProductCatalogAPI.DTOs.GameDtos;
using ProductCatalogAPI.Services;

namespace ProductCatalogAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : ControllerBase
{
    private const string PlayerTokenHeader = "X-Player-Token";

    private readonly IGameService _gameService;

    public GameController(IGameService gameService)
    {
        _gameService = gameService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateGameDto dto)
    {
        var result = await _gameService.CreateGameAsync(dto);
        return Ok(ApiResponseDto<CreateGameResponseDto>.SuccessResult(result, "Game created successfully"));
    }

    [HttpPost("{joinCode}/join")]
    public async Task<IActionResult> Join(string joinCode, [FromBody] JoinGameDto dto)
    {
        var result = await _gameService.JoinGameAsync(joinCode, dto);
        return Ok(ApiResponseDto<JoinGameResponseDto>.SuccessResult(result, "Joined game successfully"));
    }

    [HttpPost("{sessionId:guid}/placement")]
    public async Task<IActionResult> PlaceFleet(Guid sessionId, [FromBody] PlaceFleetDto dto)
    {
        var token = GetPlayerToken();
        var result = await _gameService.PlaceFleetAsync(sessionId, token, dto);
        return Ok(ApiResponseDto<GameStateDto>.SuccessResult(result, "Fleet placed successfully"));
    }

    [HttpPost("{sessionId:guid}/attack")]
    public async Task<IActionResult> Attack(Guid sessionId, [FromBody] AttackRequestDto dto)
    {
        var token = GetPlayerToken();
        var result = await _gameService.AttackAsync(sessionId, token, dto);
        return Ok(ApiResponseDto<AttackResponseDto>.SuccessResult(result, "Attack resolved"));
    }

    [HttpGet("{sessionId:guid}")]
    public async Task<IActionResult> GetState(Guid sessionId)
    {
        var token = GetPlayerToken();
        var result = await _gameService.GetStateAsync(sessionId, token);
        return Ok(ApiResponseDto<GameStateDto>.SuccessResult(result, "Game state retrieved"));
    }

    private string GetPlayerToken()
    {
        var token = Request.Headers[PlayerTokenHeader].ToString();
        if (string.IsNullOrWhiteSpace(token))
            throw new UnauthorizedAccessException($"Missing {PlayerTokenHeader} header.");
        return token;
    }
}
