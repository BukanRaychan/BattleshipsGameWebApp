namespace ProductCatalogAPI.DTOs.GameDtos;

public class CreateGameResponseDto
{
    public Guid SessionId { get; set; }
    public Guid PlayerId { get; set; }
    public string JoinCode { get; set; } = string.Empty;
    public string PlayerToken { get; set; } = string.Empty;
}
