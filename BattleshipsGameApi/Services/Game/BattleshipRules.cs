using ProductCatalogAPI.DTOs.GameDtos;
using ProductCatalogAPI.Enums;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Services.Game;
public static class BattleshipRules
{
    public static readonly int[] RequiredShipLengths = { 5, 4, 3, 3, 2 };

    /// <summary>Validates a submitted fleet. Returns an error message, or null when the placement is legal.</summary>
    public static string? ValidatePlacement(IReadOnlyList<ShipPlacementDto> ships, int boardSize)
    {
        if (ships == null || ships.Count == 0)
            return "No ships submitted.";

        var submittedLengths = ships.Select(s => (int)s.ShipType).OrderBy(l => l).ToArray();
        var required = RequiredShipLengths.OrderBy(l => l).ToArray();
        if (!submittedLengths.SequenceEqual(required))
            return $"Invalid fleet. Expected ships of lengths [{string.Join(",", required)}], got [{string.Join(",", submittedLengths)}].";

        var occupied = new HashSet<(int X, int Y)>();

        foreach (var ship in ships)
        {
            int length = (int)ship.ShipType;
            var cells = ship.Cells;

            if (cells.Count != length)
                return $"A {ship.ShipType} must occupy {length} cells but has {cells.Count}.";

            if (cells.Any(c => c.X < 0 || c.X >= boardSize || c.Y < 0 || c.Y >= boardSize))
                return $"A {ship.ShipType} has cells outside the {boardSize}x{boardSize} board.";

            if (!IsContiguousLine(cells, ship.Orientation))
                return $"A {ship.ShipType}'s cells must form a straight {ship.Orientation} line.";
                
            foreach (var c in cells)
            {
                for (int dx = -1; dx <= 1; dx++)
                    for (int dy = -1; dy <= 1; dy++)
                        if (occupied.Contains((c.X + dx, c.Y + dy)))
                            return "Ships must not overlap or touch each other (including diagonally).";
            }

            foreach (var c in cells)
                occupied.Add((c.X, c.Y));
        }

        return null;
    }

    /// <summary>
    /// Resolves an attack against the opponent's ships. Marks the hit cell and returns the result.
    /// Mutates the matched cell's IsHit flag so the caller can persist the new state.
    /// </summary>
    public static AttackResult ResolveAttack(IEnumerable<Ship> opponentShips, int x, int y)
    {
        foreach (var ship in opponentShips)
        {
            var cell = ship.Cells.FirstOrDefault(c => c.X == x && c.Y == y);
            if (cell != null)
            {
                cell.IsHit = true;
                return ship.Cells.All(c => c.IsHit) ? AttackResult.Sunk : AttackResult.Hit;
            }
        }

        return AttackResult.Miss;
    }

    public static bool IsShipSunk(Ship ship) => ship.Cells.All(c => c.IsHit);

    public static bool AllShipsSunk(IEnumerable<Ship> ships) => ships.All(IsShipSunk);

    private static bool IsContiguousLine(List<CoordinateDto> cells, Orientation orientation)
    {
        if (cells.Count <= 1)
            return true;

        if (orientation == Orientation.Horizontal)
        {
            if (cells.Select(c => c.Y).Distinct().Count() != 1)
                return false;
            var xs = cells.Select(c => c.X).OrderBy(x => x).ToList();
            return xs.Zip(xs.Skip(1), (a, b) => b - a).All(d => d == 1);
        }

        if (cells.Select(c => c.X).Distinct().Count() != 1)
            return false;
        var ys = cells.Select(c => c.Y).OrderBy(y => y).ToList();
        return ys.Zip(ys.Skip(1), (a, b) => b - a).All(d => d == 1);
    }
}
