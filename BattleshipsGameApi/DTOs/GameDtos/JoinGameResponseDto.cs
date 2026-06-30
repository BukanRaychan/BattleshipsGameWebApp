namespace ProductCatalogAPI.DTOs.GameDtos;

public class JoinGameResponseDto
{
    public Guid SessionId { get; set; }
    public Guid PlayerId { get; set; }
    public string PlayerToken { get; set; } = string.Empty;
}
