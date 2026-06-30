import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Anchor, Trophy } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/store/gameStore"
import { cn } from "@/lib/utils"

export function GameOverOverlay() {
  const navigate = useNavigate()
  const game = useGameStore((s) => s.game)
  const identity = useGameStore((s) => s.identity)
  const leave = useGameStore((s) => s.leave)

  if (!game || game.status !== "Finished") return null
  const won = game.winnerPlayerId === identity?.playerId

  function newGame() {
    leave()
    navigate("/")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      >
        <div
          className={cn(
            "mx-auto mb-4 grid size-16 place-items-center rounded-lg",
            won ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {won ? (
            <Trophy weight="fill" className="size-8" />
          ) : (
            <Anchor weight="fill" className="size-8" />
          )}
        </div>
        <h2 className="font-heading text-3xl font-bold">
          {won ? "Victory!" : "Defeated"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {won
            ? "You sank the enemy fleet. Well commanded, Admiral."
            : "Your fleet lies at the bottom of the sea. Regroup and try again."}
        </p>
        <Button size="lg" className="mt-6 w-full" onClick={newGame}>
          New game
        </Button>
      </motion.div>
    </motion.div>
  )
}
