namespace ProductCatalogAPI.DTOs.GameDtos;

public class PlaceFleetDto
{
    public List<ShipPlacementDto> Ships { get; set; } = new();
}
