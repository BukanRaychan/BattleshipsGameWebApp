namespace ProductCatalogAPI.Models;

public class Cell
{
    public int Id { get; set; }
    public int ShipId { get; set; }
    public Ship Ship { get; set; } = null!;

    public int X { get; set; }
    public int Y { get; set; }
    public bool IsHit { get; set; }
}
