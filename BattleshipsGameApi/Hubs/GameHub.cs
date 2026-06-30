using Microsoft.AspNetCore.SignalR;
using ProductCatalogAPI.Repositories;

namespace ProductCatalogAPI.Hubs;

/// <summary>
/// Pushes game state changes to both players. Web-native replacement for the console
/// app's MessageDelegate. Clients connect with ?playerToken=... and are added to a
/// SignalR group named by their session id; the GameService broadcasts to that group.
/// </summary>
public class GameHub : Hub
{
    private readonly IGameRepository _gameRepository;

    public GameHub(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public static string SessionGroup(Guid sessionId) => $"session-{sessionId}";

    public override async Task OnConnectedAsync()
    {
        var token = Context.GetHttpContext()?.Request.Query["playerToken"].ToString();

        if (!string.IsNullOrEmpty(token))
        {
            var player = await _gameRepository.GetPlayerByTokenAsync(token);
            if (player != null)
                await Groups.AddToGroupAsync(Context.ConnectionId, SessionGroup(player.SessionId));
        }

        await base.OnConnectedAsync();
    }
}
