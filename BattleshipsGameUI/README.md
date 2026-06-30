# Battleships — Web UI

Two-player Battleships frontend. React 19 + Vite + Tailwind v4 + shadcn primitives,
talking to the ASP.NET Core API in `../BattleshipsGameApi` over REST + SignalR.

## Run

```bash
# 1. start the API (from ../BattleshipsGameApi)
dotnet run --launch-profile http        # serves http://localhost:5280

# 2. start the UI (from here)
npm install
npm run dev                              # serves http://localhost:5173
```

The API base URL defaults to `http://localhost:5280`. Override with a `.env`:

```
VITE_API_BASE_URL=http://localhost:5280
```

### Playing locally with two players

Identity is stored in **sessionStorage** (per tab), so two players can share one
machine: open the game in two separate windows (e.g. one normal + one incognito).
Create a game in the first, copy the join code/link, and join from the second.

## Flow

1. **Home** (`/`) — create a game or join with a code. `/join/:code` pre-fills the code.
2. **Waiting room** — share the join code/link; the game starts when player two joins.
3. **Placement** — drag ships onto the grid (click a ship to rotate, or use Random),
   then *Ready for battle*.
4. **Battle** — fire on enemy waters on your turn; SignalR pushes every move live.
5. **Game over** — victory/defeat, then start a new game.

## Structure

- `services/` — `api.ts` (fetch + `X-Player-Token`), `gameService.ts` (REST calls)
- `store/gameStore.ts` — Zustand store (authoritative game state + actions)
- `hooks/useGameConnection.ts` — SignalR channel; every event triggers a refresh
- `lib/placement.ts` — local placement validation mirroring the backend rules
- `components/game/` — board, ship pieces, placement (dnd-kit), battle, overlays
- `pages/` — `HomePage`, `GamePage`
