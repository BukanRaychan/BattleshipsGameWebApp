using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.Models;

public class Ship
{
    public int Id { get; set; }
    public Guid PlayerId { get; set; }
    public Player Player { get; set; } = null!;

    public ShipType ShipType { get; set; }
    public Orientation Orientation { get; set; }

    public ICollection<Cell> Cells { get; set; } = new List<Cell>();
}
