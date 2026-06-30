import { motion } from "framer-motion"
import type { AttackResult } from "@/types/game"
import { cn } from "@/lib/utils"

/** A peg dropped on a cell after a shot — fills its (cell-sized) parent box. */
export function ShotMarker({
  result,
  emphatic,
}: {
  result: AttackResult
  emphatic?: boolean
}) {
  const isHit = result === "Hit" || result === "Sunk"

  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {emphatic && isHit && (
        <motion.span
          className="absolute rounded-full bg-hit/40"
          initial={{ width: "40%", height: "40%", opacity: 0.7 }}
          animate={{ width: "150%", height: "150%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
      )}
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "block rounded-full",
          isHit
            ? "size-[42%] bg-hit shadow-[0_0_10px_-1px_var(--hit)]"
            : "size-[26%] bg-miss/70 ring-1 ring-background/40"
        )}
      />
    </div>
  )
}
