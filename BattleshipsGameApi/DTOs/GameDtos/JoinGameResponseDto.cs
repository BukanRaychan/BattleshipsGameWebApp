namespace ProductCatalogAPI.DTOs.GameDtos;

public class JoinGameResponseDto
{
    public Guid SessionId { get; set; }
    public string PlayerToken { get; set; } = string.Empty;
}
