import { motion, useReducedMotion } from "framer-motion"
import type { CSSProperties } from "react"
import { BoardShell } from "@/components/game/Board"
import { ShipPiece } from "@/components/game/ShipPiece"
import { ShotMarker } from "@/components/game/ShotMarker"
import { cellBox, shipBox } from "@/lib/boardGeometry"
import type { AttackResult, Orientation, ShipType } from "@/types/game"

const PREVIEW_CELL = "clamp(20px, 3.4vw, 32px)"

// A real, static snapshot of a game in progress — uses the same board and ship
// components the live game renders, so it is a genuine preview, not a mockup.
const SHIPS: {
  type: ShipType
  length: number
  orientation: Orientation
  anchor: { x: number; y: number }
  sunk?: boolean
}[] = [
  { type: "Carrier", length: 5, orientation: "Vertical", anchor: { x: 1, y: 1 } },
  { type: "Battleship", length: 4, orientation: "Horizontal", anchor: { x: 4, y: 7 } },
  { type: "Cruiser", length: 3, orientation: "Vertical", anchor: { x: 7, y: 2 }, sunk: true },
]

const SHOTS: { x: number; y: number; result: AttackResult }[] = [
  { x: 1, y: 1, result: "Hit" },
  { x: 1, y: 2, result: "Hit" },
  { x: 7, y: 2, result: "Sunk" },
  { x: 7, y: 3, result: "Sunk" },
  { x: 7, y: 4, result: "Sunk" },
  { x: 4, y: 4, result: "Miss" },
  { x: 9, y: 6, result: "Miss" },
  { x: 2, y: 8, result: "Miss" },
]

export function HeroBoardPreview() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className="relative"
      initial={reduce ? false : { y: 0 }}
      animate={reduce ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-accent/40 opacity-60 blur-3xl" />
      <div className="relative">
        <BoardShell size={10} cell={PREVIEW_CELL}>
          {SHIPS.map((s) => (
            <div key={s.type} style={shipBox(s.anchor, s.orientation, s.length)}>
              <ShipPiece
                type={s.type}
                length={s.length}
                orientation={s.orientation}
                variant={s.sunk ? "sunk" : "normal"}
              />
            </div>
          ))}
          <div className="absolute inset-0">
            {SHOTS.map((shot, i) => (
              <div key={i} style={cellBox(shot.x, shot.y) as CSSProperties}>
                <ShotMarker result={shot.result} />
              </div>
            ))}
          </div>
        </BoardShell>
      </div>
    </motion.div>
  )
}
