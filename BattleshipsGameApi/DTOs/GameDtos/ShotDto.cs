using ProductCatalogAPI.Enums;

namespace ProductCatalogAPI.DTOs.GameDtos;

public class ShotDto
{
    public int X { get; set; }
    public int Y { get; set; }
    public AttackResult Result { get; set; }
}
