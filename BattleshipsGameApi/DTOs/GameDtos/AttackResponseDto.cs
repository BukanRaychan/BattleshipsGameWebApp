using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.DTOs.GameDtos;

public class AttackResponseDto
{
    public CoordinateDto Target { get; set; } = new();
    public AttackResult Result { get; set; }
    public bool IsGameOver { get; set; }
    public Guid? WinnerPlayerId { get; set; }
    public Guid CurrentTurnPlayerId { get; set; }
}
