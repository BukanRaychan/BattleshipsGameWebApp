using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Repositories;

public interface IGameRepository
{
    Task<Session> CreateAsync(Session session);
    Task<Session?> GetByIdAsync(Guid sessionId);
    Task<Session?> GetByJoinCodeAsync(string joinCode);
    Task<Player?> GetPlayerByTokenAsync(string playerToken);
    Task<bool> JoinCodeExistsAsync(string joinCode);
    Task SaveChangesAsync();
}
