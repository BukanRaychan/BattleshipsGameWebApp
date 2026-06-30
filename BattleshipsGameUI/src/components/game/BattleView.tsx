import { motion } from "framer-motion"
import { BoardShell } from "@/components/game/Board"
import { ShipPiece } from "@/components/game/ShipPiece"
import { ShotMarker } from "@/components/game/ShotMarker"
import { cellBox, shipBox } from "@/lib/boardGeometry"
import { cn } from "@/lib/utils"
import { useGameStore } from "@/store/gameStore"
import type { BoardView, Orientation, ShipView } from "@/types/game"

const BATTLE_CELL = "clamp(22px, min(6vw, 5.5vh), 38px)"

function geometry(ship: ShipView) {
  const xs = ship.cells.map((c) => c.x)
  const ys = ship.cells.map((c) => c.y)
  const orientation: Orientation = ship.orientation
  return {
    anchor: { x: Math.min(...xs), y: Math.min(...ys) },
    length: ship.cells.length,
    orientation,
  }
}

function shotKey(x: number, y: number) {
  return `${x},${y}`
}

function Ships({ board, revealSunkOnly }: { board: BoardView; revealSunkOnly?: boolean }) {
  return (
    <>
      {board.ships.map((ship, i) => {
        const g = geometry(ship)
        return (
          <div key={i} style={shipBox(g.anchor, g.orientation, g.length)}>
            <ShipPiece
              type={ship.shipType}
              length={g.length}
              orientation={g.orientation}
              variant={revealSunkOnly || ship.isSunk ? "sunk" : "normal"}
            />
          </div>
        )
      })}
    </>
  )
}

function Markers({ board, emphaticKey }: { board: BoardView; emphaticKey?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {board.shots.map((shot, i) => (
        <div key={i} style={cellBox(shot.x, shot.y)}>
          <ShotMarker
            result={shot.result}
            emphatic={emphaticKey === shotKey(shot.x, shot.y)}
          />
        </div>
      ))}
    </div>
  )
}

function TargetGrid({
  size,
  shots,
  yourTurn,
  onFire,
}: {
  size: number
  shots: Set<string>
  yourTurn: boolean
  onFire: (x: number, y: number) => void
}) {
  return (
    <div
      className="absolute inset-0 z-10 grid gap-px"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {Array.from({ length: size * size }).map((_, i) => {
        const x = i % size
        const y = Math.floor(i / size)
        const fired = shots.has(shotKey(x, y))
        const canFire = yourTurn && !fired
        return (
          <button
            key={i}
            disabled={!canFire}
            onClick={() => onFire(x, y)}
            aria-label={`Fire at ${String.fromCharCode(65 + x)}${y + 1}`}
            className={cn(
              "rounded-[2px] transition-colors duration-100",
              canFire
                ? "cursor-crosshair hover:bg-primary/25 hover:ring-2 hover:ring-primary/60"
                : "cursor-default"
            )}
          />
        )
      })}
    </div>
  )
}

export function BattleView() {
  const game = useGameStore((s) => s.game)
  const lastShot = useGameStore((s) => s.lastShot)
  const fireAttack = useGameStore((s) => s.fireAttack)

  if (!game) return null

  const size = game.boardSize
  const myShots = new Set(game.opponentBoard.shots.map((s) => shotKey(s.x, s.y)))
  const enemySunk = game.opponentBoard.ships.length
  const myAfloat = 5 - game.ownBoard.ships.filter((s) => s.isSunk).length

  const emphaticOnOpponent =
    lastShot?.byMe ? shotKey(lastShot.x, lastShot.y) : undefined
  const emphaticOnOwn =
    lastShot && !lastShot.byMe ? shotKey(lastShot.x, lastShot.y) : undefined

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div
        key={game.yourTurn ? "you" : "them"}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "rounded-full px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
          game.yourTurn
            ? "bg-accent text-accent-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {game.yourTurn ? "Your move. Fire at will." : "Opponent is taking aim"}
      </motion.div>

      <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-[0.1em]">
              Enemy waters
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {enemySunk}/5 sunk
            </span>
          </div>
          <BoardShell size={size} cell={BATTLE_CELL} dimmed={!game.yourTurn}>
            <Ships board={game.opponentBoard} revealSunkOnly />
            <TargetGrid
              size={size}
              shots={myShots}
              yourTurn={game.yourTurn}
              onFire={fireAttack}
            />
            <Markers board={game.opponentBoard} emphaticKey={emphaticOnOpponent} />
          </BoardShell>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-[0.1em]">
              Your fleet
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {myAfloat}/5 afloat
            </span>
          </div>
          <BoardShell size={size} cell={BATTLE_CELL}>
            <Ships board={game.ownBoard} />
            <Markers board={game.ownBoard} emphaticKey={emphaticOnOwn} />
          </BoardShell>
        </div>
      </div>
    </div>
  )
}
