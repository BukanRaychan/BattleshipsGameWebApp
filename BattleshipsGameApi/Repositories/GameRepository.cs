using Microsoft.EntityFrameworkCore;
using ProductCatalogAPI.Data;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Repositories;

public class GameRepository : IGameRepository
{
    private readonly AppDbContext _context;

    public GameRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Session> CreateAsync(Session session)
    {
        _context.Sessions.Add(session);
        await _context.SaveChangesAsync();
        return session;
    }

    public async Task<Session?> GetByIdAsync(Guid sessionId)
    {
        return await LoadFullSession()
            .FirstOrDefaultAsync(s => s.Id == sessionId);
    }

    public async Task<Session?> GetByJoinCodeAsync(string joinCode)
    {
        return await LoadFullSession()
            .FirstOrDefaultAsync(s => s.JoinCode == joinCode);
    }

    public async Task<Player?> GetPlayerByTokenAsync(string playerToken)
    {
        return await _context.Players
            .FirstOrDefaultAsync(p => p.PlayerToken == playerToken);
    }

    public async Task<bool> JoinCodeExistsAsync(string joinCode)
    {
        return await _context.Sessions.AnyAsync(s => s.JoinCode == joinCode);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    private IQueryable<Session> LoadFullSession()
    {
        return _context.Sessions
            .Include(s => s.Players)
                .ThenInclude(p => p.Ships)
                    .ThenInclude(sh => sh.Cells)
            .Include(s => s.Attacks);
    }
}
