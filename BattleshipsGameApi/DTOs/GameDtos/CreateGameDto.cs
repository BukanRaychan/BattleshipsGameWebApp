namespace ProductCatalogAPI.DTOs.GameDtos;

public class CreateGameDto
{
    public string PlayerName { get; set; } = string.Empty;
    public int BoardSize { get; set; } = 10;
}
