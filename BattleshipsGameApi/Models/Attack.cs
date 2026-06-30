using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.Models;

public class Attack
{
    public int Id { get; set; }
    public Guid SessionId { get; set; }
    public Session Session { get; set; } = null!;

    public Guid AttackingPlayerId { get; set; }
    public Player AttackingPlayer { get; set; } = null!;
    public int X { get; set; }
    public int Y { get; set; }
    public AttackResult Result { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
