import type { ShipType } from "@/types/game"

import carrier from "@/assets/ShipCarrierHull.png"
import battleship from "@/assets/ShipBattleshipHull.png"
import cruiser from "@/assets/ShipCruiserHull.png"
import submarine from "@/assets/ShipSubMarineHull.png"
import destroyer from "@/assets/ShipDestroyerHull.png"

export const BOARD_SIZE = 10

export type ShipMeta = {
  type: ShipType
  label: string
  length: number
  art: string
}

/**
 * The standard fleet, ordered largest → smallest. `length` is the cell count.
 * Note: Cruiser and Submarine share length 3 — the backend keys ships by length
 * multiset, so both are required exactly once.
 */
export const FLEET: ShipMeta[] = [
  { type: "Carrier", label: "Carrier", length: 5, art: carrier },
  { type: "Battleship", label: "Battleship", length: 4, art: battleship },
  { type: "Cruiser", label: "Cruiser", length: 3, art: cruiser },
  { type: "Submarine", label: "Submarine", length: 3, art: submarine },
  { type: "Destroyer", label: "Destroyer", length: 2, art: destroyer },
]

export const SHIP_ART: Record<ShipType, string> = {
  Carrier: carrier,
  Battleship: battleship,
  Cruiser: cruiser,
  Submarine: submarine,
  Destroyer: destroyer,
}

/** Ship art is drawn vertically (bow up); rotate when laid horizontally. */
export const SHIP_ART_BASE_ORIENTATION = "Vertical" as const

/** Resolve a ship's hull art. Falls back by length for the Cruiser/Submarine
 *  collision when the server can't disambiguate the two length-3 ships. */
export function artForShip(type: ShipType, length: number): string {
  if (SHIP_ART[type]) return SHIP_ART[type]
  return length === 3 ? cruiser : destroyer
}

export const COLUMN_LABELS = "ABCDEFGHIJ".split("")
