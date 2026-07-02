import type { Coordinate, Orientation, ShipType } from "@/types/game"
import { FLEET } from "@/lib/constants"

/** A ship the player has dropped on the board, anchored at its head cell. */
export type PlacedShip = {
  type: ShipType
  length: number
  orientation: Orientation
  anchor: Coordinate
}

export function cellsFor(
  anchor: Coordinate,
  orientation: Orientation,
  length: number
): Coordinate[] {
  const cells: Coordinate[] = []
  for (let i = 0; i < length; i++) {
    cells.push(
      orientation === "Horizontal"
        ? { x: anchor.x + i, y: anchor.y }
        : { x: anchor.x, y: anchor.y + i }
    )
  }
  return cells
}

export function shipCells(ship: PlacedShip): Coordinate[] {
  return cellsFor(ship.anchor, ship.orientation, ship.length)
}

function inBounds(cells: Coordinate[], size: number): boolean {
  return cells.every((c) => c.x >= 0 && c.x < size && c.y >= 0 && c.y < size)
}

const key = (x: number, y: number) => `${x},${y}`

/**
 * Mirrors the backend BattleshipRules: in-bounds, no overlap, and no adjacency
 * (a one-cell buffer around every ship, including diagonals). `ignore` lets a
 * ship be re-validated against the others while moving it.
 */
export function canPlace(
  candidate: Coordinate[],
  others: PlacedShip[],
  size: number,
  ignore?: ShipType
): boolean {
  if (!inBounds(candidate, size)) return false

  const blocked = new Set<string>()
  for (const ship of others) {
    if (ship.type === ignore) continue
    for (const c of shipCells(ship)) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          blocked.add(key(c.x + dx, c.y + dy))
        }
      }
    }
  }

  return candidate.every((c) => !blocked.has(key(c.x, c.y)))
}

export function isFleetComplete(ships: PlacedShip[]): boolean {
  return ships.length === FLEET.length
}

/** Auto-place the full fleet at random, respecting all placement rules. */
export function randomFleet(size: number): PlacedShip[] {
  const placed: PlacedShip[] = []

  for (const meta of FLEET) {
    let attempts = 0
    while (attempts < 500) {
      attempts++
      const orientation: Orientation =
        Math.random() < 0.5 ? "Horizontal" : "Vertical"
      const maxX =
        orientation === "Horizontal" ? size - meta.length : size - 1
      const maxY =
        orientation === "Vertical" ? size - meta.length : size - 1
      const anchor = {
        x: Math.floor(Math.random() * (maxX + 1)),
        y: Math.floor(Math.random() * (maxY + 1)),
      }
      const candidate = cellsFor(anchor, orientation, meta.length)
      if (canPlace(candidate, placed, size)) {
        placed.push({ type: meta.type, length: meta.length, orientation, anchor })
        break
      }
    }
  }

  return placed.length === FLEET.length ? placed : randomFleet(size)
}
