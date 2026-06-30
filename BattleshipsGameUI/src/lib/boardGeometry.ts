import type { CSSProperties } from "react"
import type { Coordinate, Orientation } from "@/types/game"

/** A single cell's absolute box within the board area. */
export function cellBox(x: number, y: number): CSSProperties {
  return {
    position: "absolute",
    left: `calc(var(--cell) * ${x})`,
    top: `calc(var(--cell) * ${y})`,
    width: "var(--cell)",
    height: "var(--cell)",
  }
}

/** A ship's footprint box, anchored at its head cell. */
export function shipBox(
  anchor: Coordinate,
  orientation: Orientation,
  length: number
): CSSProperties {
  const along = `calc(var(--cell) * ${length})`
  const across = "var(--cell)"
  return {
    position: "absolute",
    left: `calc(var(--cell) * ${anchor.x})`,
    top: `calc(var(--cell) * ${anchor.y})`,
    width: orientation === "Horizontal" ? along : across,
    height: orientation === "Vertical" ? along : across,
  }
}
