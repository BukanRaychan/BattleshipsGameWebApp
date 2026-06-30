namespace ProductCatalogAPI.Models;

public class Player
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SessionId { get; set; }
    public Session Session { get; set; } = null!;

    public string PlayerToken { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsHost { get; set; }
    public bool IsReady { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Ship> Ships { get; set; } = new List<Ship>();
}
