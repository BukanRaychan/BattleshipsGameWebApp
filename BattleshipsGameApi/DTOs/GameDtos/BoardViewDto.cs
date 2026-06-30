namespace ProductCatalogAPI.DTOs.GameDtos;

public class BoardViewDto
{
    public int Size { get; set; }
    public List<ShipViewDto> Ships { get; set; } = new();
    public List<ShotDto> Shots { get; set; } = new();
}
