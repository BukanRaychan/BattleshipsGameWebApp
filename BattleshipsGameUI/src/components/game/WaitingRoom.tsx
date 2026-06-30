import { useState } from "react"
import { Check, Copy, LinkSimple } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/store/gameStore"

export function WaitingRoom() {
  const identity = useGameStore((s) => s.identity)
  const [copied, setCopied] = useState<"code" | "link" | null>(null)

  const joinCode = identity?.joinCode ?? ""
  const joinLink = `${window.location.origin}/join/${joinCode}`

  function copy(value: string, which: "code" | "link") {
    void navigator.clipboard.writeText(value)
    setCopied(which)
    window.setTimeout(() => setCopied(null), 1600)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold">Waiting for a challenger</h2>
        <p className="text-sm text-muted-foreground">
          Share this code or link. The battle begins the moment they join.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {joinCode.split("").map((ch, i) => (
            <span
              key={i}
              className="flex size-12 items-center justify-center rounded-md border border-border bg-muted font-mono text-2xl font-semibold"
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      <div className="flex w-full gap-2">
        <Button variant="outline" className="flex-1" onClick={() => copy(joinCode, "code")}>
          {copied === "code" ? <Check weight="bold" /> : <Copy weight="bold" />}
          {copied === "code" ? "Copied" : "Copy code"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => copy(joinLink, "link")}>
          {copied === "link" ? <Check weight="bold" /> : <LinkSimple weight="bold" />}
          {copied === "link" ? "Copied" : "Copy link"}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
        </span>
        Listening for the second player…
      </div>
    </div>
  )
}
