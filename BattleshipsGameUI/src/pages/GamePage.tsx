import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Anchor, SignOut } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { WaitingRoom } from "@/components/game/WaitingRoom"
import { PlacementView } from "@/components/game/PlacementView"
import { BattleView } from "@/components/game/BattleView"
import { GameOverOverlay } from "@/components/game/GameOverOverlay"
import { useGameConnection } from "@/hooks/useGameConnection"
import { loadIdentity } from "@/lib/identity"
import { useGameStore } from "@/store/gameStore"
import { cn } from "@/lib/utils"

function Loading() {
  return (
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <span className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="text-sm">Connecting to the battle…</span>
    </div>
  )
}

function DeployedWaiting() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="relative flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
        <span className="relative inline-flex size-3 rounded-full bg-primary" />
      </span>
      <h2 className="font-heading text-xl font-semibold">Fleet deployed</h2>
      <p className="max-w-xs text-sm text-muted-foreground">
        Waiting for your opponent to position their ships…
      </p>
    </div>
  )
}

export function GamePage() {
  const navigate = useNavigate()
  const { sessionId } = useParams<{ sessionId: string }>()
  const identity = useGameStore((s) => s.identity)
  const game = useGameStore((s) => s.game)
  const setIdentity = useGameStore((s) => s.setIdentity)
  const leave = useGameStore((s) => s.leave)

  useEffect(() => {
    if (identity?.sessionId === sessionId) return
    const stored = loadIdentity()
    if (stored && stored.sessionId === sessionId) {
      setIdentity(stored)
    } else {
      navigate("/", { replace: true })
    }
  }, [sessionId, identity, setIdentity, navigate])

  const token =
    identity && identity.sessionId === sessionId
      ? identity.playerToken
      : undefined
  const { connected } = useGameConnection(token)

  function handleLeave() {
    leave()
    navigate("/")
  }

  function renderPhase() {
    if (!game) return <Loading />
    switch (game.status) {
      case "WaitingForPlayers":
        return <WaitingRoom />
      case "Placement":
        return game.ownBoard.ships.length === 5 ? (
          <DeployedWaiting />
        ) : (
          <PlacementView />
        )
      case "InProgress":
      case "Finished":
        return <BattleView />
      default:
        return <Loading />
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Anchor weight="bold" className="size-5" />
          <span className="font-heading text-lg font-semibold tracking-tight">
            Battleships
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={cn(
                "size-2 rounded-full",
                connected ? "bg-foreground" : "animate-pulse bg-muted-foreground"
              )}
            />
            {connected ? "Live" : "Connecting"}
          </span>
          <Button variant="ghost" size="sm" onClick={handleLeave}>
            <SignOut weight="bold" /> Leave
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        {renderPhase()}
      </main>

      <GameOverOverlay />
    </div>
  )
}
