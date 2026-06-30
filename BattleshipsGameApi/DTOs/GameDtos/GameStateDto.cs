using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.DTOs.GameDtos;

public class GameStateDto
{
    public Guid SessionId { get; set; }
    public GameStatus Status { get; set; }
    public int BoardSize { get; set; }
    public BoardViewDto OwnBoard { get; set; } = new();
    public BoardViewDto OpponentBoard { get; set; } = new();
    public Guid? CurrentTurnPlayerId { get; set; }
    public bool YourTurn { get; set; }
    public Guid? WinnerPlayerId { get; set; }
}
