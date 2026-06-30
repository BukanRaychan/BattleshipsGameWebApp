import type { CSSProperties, ReactNode } from "react"
import { COLUMN_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"

function WaterBackdrop({ size }: { size: number }) {
  return (
    <div
      className="grid h-full w-full gap-px overflow-hidden rounded-md bg-water-deep/60"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {Array.from({ length: size * size }).map((_, i) => (
        <div key={i} className="bg-water" />
      ))}
    </div>
  )
}

type BoardShellProps = {
  size: number
  /** CSS length for one cell; tune per layout. */
  cell?: string
  children?: ReactNode
  className?: string
  dimmed?: boolean
}

/**
 * The labelled board frame: column letters, row numbers, the water grid, and an
 * absolutely-positioned overlay layer (`children`) for ships and shot markers.
 */
export function BoardShell({
  size,
  cell = "clamp(26px, 7vw, 42px)",
  children,
  className,
  dimmed,
}: BoardShellProps) {
  const cols = COLUMN_LABELS.slice(0, size)
  const rows = Array.from({ length: size }, (_, i) => i + 1)

  return (
    <div
      className={cn(
        "select-none transition-opacity duration-200",
        dimmed && "opacity-60",
        className
      )}
      style={{ "--cell": cell, "--gutter": "1.15rem" } as CSSProperties}
    >
      <div className="flex" style={{ paddingLeft: "var(--gutter)" }}>
        {cols.map((c) => (
          <div
            key={c}
            className="text-center text-[0.62rem] font-medium text-muted-foreground"
            style={{ width: "var(--cell)" }}
          >
            {c}
          </div>
        ))}
      </div>

      <div className="flex">
        <div
          className="flex flex-col"
          style={{ width: "var(--gutter)" }}
        >
          {rows.map((r) => (
            <div
              key={r}
              className="flex items-center justify-center text-[0.62rem] font-medium text-muted-foreground"
              style={{ height: "var(--cell)" }}
            >
              {r}
            </div>
          ))}
        </div>

        <div
          className="relative rounded-md shadow-sm ring-1 ring-border"
          style={{
            width: `calc(var(--cell) * ${size})`,
            height: `calc(var(--cell) * ${size})`,
          }}
        >
          <WaterBackdrop size={size} />
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
