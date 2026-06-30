using ProductCatalogAPI.DTOs.GameDtos;

namespace ProductCatalogAPI.Services;

public interface IGameService
{
    Task<CreateGameResponseDto> CreateGameAsync(CreateGameDto dto);
    Task<JoinGameResponseDto> JoinGameAsync(string joinCode, JoinGameDto dto);
    Task<GameStateDto> PlaceFleetAsync(Guid sessionId, string playerToken, PlaceFleetDto dto);
    Task<AttackResponseDto> AttackAsync(Guid sessionId, string playerToken, AttackRequestDto dto);
    Task<GameStateDto> GetStateAsync(Guid sessionId, string playerToken);
}
