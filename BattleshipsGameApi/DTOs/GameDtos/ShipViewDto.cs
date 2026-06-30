using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.DTOs.GameDtos;

public class ShipViewDto
{
    public ShipType ShipType { get; set; }
    public Orientation Orientation { get; set; }
    public bool IsSunk { get; set; }
    public List<CoordinateDto> Cells { get; set; } = new();
}
