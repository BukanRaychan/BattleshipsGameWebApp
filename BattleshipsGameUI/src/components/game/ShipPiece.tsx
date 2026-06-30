import { artForShip } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Orientation, ShipType } from "@/types/game"

type ShipPieceVariant = "normal" | "sunk" | "invalid" | "dragging"

type ShipPieceProps = {
  type: ShipType
  length: number
  orientation: Orientation
  variant?: ShipPieceVariant
  className?: string
}

/**
 * Renders a ship hull filling its parent footprint box. The art is drawn
 * vertically (bow up); a horizontal ship rotates the same art 90°.
 */
export function ShipPiece({
  type,
  length,
  orientation,
  variant = "normal",
  className,
}: ShipPieceProps) {
  const isHorizontal = orientation === "Horizontal"

  return (
    <div
      className={cn(
        "pointer-events-none relative h-full w-full transition-[filter,transform] duration-150",
        variant === "dragging" && "scale-[1.04] drop-shadow-xl",
        className
      )}
    >
      <img
        src={artForShip(type, length)}
        alt={type}
        draggable={false}
        className={cn(
          "select-none",
          variant === "sunk" && "brightness-75 grayscale-[0.35]",
          variant === "invalid" && "saturate-[0.25]"
        )}
        style={
          isHorizontal
            ? {
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "var(--cell)",
                height: `calc(var(--cell) * ${length})`,
                transform: "translate(-50%, -50%) rotate(90deg)",
                objectFit: "fill",
              }
            : { width: "100%", height: "100%", objectFit: "fill" }
        }
      />
      {variant === "sunk" && (
        <div className="absolute inset-0 rounded-[2px] bg-sunk/25 ring-2 ring-sunk/60" />
      )}
    </div>
  )
}
