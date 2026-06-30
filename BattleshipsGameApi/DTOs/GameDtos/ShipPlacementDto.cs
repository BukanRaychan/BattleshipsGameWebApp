using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.DTOs.GameDtos;

public class ShipPlacementDto
{
    public ShipType ShipType { get; set; }
    public Orientation Orientation { get; set; }
    public List<CoordinateDto> Cells { get; set; } = new();
}
