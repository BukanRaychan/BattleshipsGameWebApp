using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.Models;

public class Session
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string JoinCode { get; set; } = string.Empty;
    public GameStatus Status { get; set; } = GameStatus.WaitingForPlayers;
    public int BoardSize { get; set; } = 10;
    public Guid? CurrentTurnPlayerId { get; set; }
    public Guid? WinnerPlayerId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Player> Players { get; set; } = new List<Player>();
    public ICollection<Attack> Attacks { get; set; } = new List<Attack>();
}
