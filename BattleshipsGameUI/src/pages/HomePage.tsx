import { useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Anchor } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HeroBoardPreview } from "@/components/game/HeroBoardPreview"
import { createGame, joinGame } from "@/services/gameService"
import { ApiError } from "@/services/api"
import { useGameStore } from "@/store/gameStore"
import { cn } from "@/lib/utils"

type Mode = "create" | "join"

const ENTER = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }

export function HomePage() {
  const navigate = useNavigate()
  const params = useParams<{ joinCode?: string }>()
  const setIdentity = useGameStore((s) => s.setIdentity)

  const [mode, setMode] = useState<Mode>(params.joinCode ? "join" : "create")
  const [name, setName] = useState("")
  const [code, setCode] = useState(params.joinCode?.toUpperCase() ?? "")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      if (mode === "create") {
        const res = await createGame(name.trim())
        setIdentity({
          sessionId: res.sessionId,
          playerId: res.playerId,
          playerToken: res.playerToken,
          playerName: name.trim(),
          joinCode: res.joinCode,
        })
        navigate(`/play/${res.sessionId}`)
      } else {
        const res = await joinGame(code.trim().toUpperCase(), name.trim())
        setIdentity({
          sessionId: res.sessionId,
          playerId: res.playerId,
          playerToken: res.playerToken,
          playerName: name.trim(),
        })
        navigate(`/play/${res.sessionId}`)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
      setBusy(false)
    }
  }

  const canSubmit =
    name.trim().length > 0 && (mode === "create" || code.trim().length >= 4)

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: value prop + entry form */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={ENTER}
          className="flex flex-col"
        >
          <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-accent-foreground">
            <Anchor weight="bold" className="size-3.5" /> Two-player naval combat
          </div>

          <h1 className="font-heading text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Battleships
          </h1>

          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
            Place your fleet, take turns firing, and sink all five of your
            opponent's ships before they sink yours.
          </p>

          <Card className="mt-8 w-full max-w-md">
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(["create", "join"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m)
                    setError(null)
                  }}
                  className={cn(
                    "rounded-md py-2 text-sm font-medium transition-all duration-150",
                    mode === m
                      ? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {m === "create" ? "Create game" : "Join game"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Captain Reyes"
                  maxLength={30}
                  autoFocus
                />
              </div>

              {mode === "join" && (
                <div>
                  <Label htmlFor="code">Join code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="font-mono uppercase tracking-[0.3em]"
                    maxLength={12}
                  />
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!canSubmit || busy}
              >
                {busy
                  ? "Please wait…"
                  : mode === "create"
                    ? "Create battle"
                    : "Join battle"}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Right: real in-product board preview as the hero asset */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...ENTER, delay: 0.12 }}
          className="hidden justify-center lg:flex"
        >
          <HeroBoardPreview />
        </motion.div>
      </div>
    </div>
  )
}
