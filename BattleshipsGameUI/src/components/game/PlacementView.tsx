import { useRef, useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { ArrowsClockwise, DiceFive, Trash } from "@phosphor-icons/react"
import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { ShipPiece } from "@/components/game/ShipPiece"
import { BoardShell } from "@/components/game/Board"
import { FLEET } from "@/lib/constants"
import { shipBox } from "@/lib/boardGeometry"
import {
  canPlace,
  cellsFor,
  randomFleet,
  shipCells,
  type PlacedShip,
} from "@/lib/placement"
import { useGameStore } from "@/store/gameStore"
import { cn } from "@/lib/utils"
import type { Orientation, ShipPlacement, ShipType } from "@/types/game"

const PLACEMENT_CELL = "clamp(28px, min(8vw, 7vh), 46px)"

type DragData = { type: ShipType; length: number; orientation: Orientation }

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function DroppableCell({ x, y }: { x: number; y: number }) {
  const { setNodeRef } = useDroppable({ id: `cell:${x}:${y}`, data: { x, y } })
  return <div className="border" ref={setNodeRef} />
}

function DroppableGrid({ size }: { size: number }) {
  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {Array.from({ length: size * size }).map((_, i) => (
        <DroppableCell key={i} x={i % size} y={Math.floor(i / size)} />
      ))}
    </div>
  )
}

function PlacedShipPiece({
  ship,
  valid,
  onRotate,
}: {
  ship: PlacedShip
  valid: boolean
  onRotate: (type: ShipType) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed:${ship.type}`,
    data: { type: ship.type, length: ship.length, orientation: ship.orientation },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onRotate(ship.type)}
      title={`${ship.type}: click to rotate, drag to move`}
      className={cn(
        "cursor-grab touch-none rounded-[3px] p-px active:cursor-grabbing",
        isDragging && "opacity-0",
        !valid && "ring-2 ring-destructive"
      )}
      style={{ ...shipBox(ship.anchor, ship.orientation, ship.length), zIndex: 10 }}
    >
      <ShipPiece
        type={ship.type}
        length={ship.length}
        orientation={ship.orientation}
        variant={valid ? "normal" : "invalid"}
      />
    </div>
  )
}

function DockShip({ type, length }: { type: ShipType; length: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `dock:${type}`,
    data: { type, length, orientation: "Horizontal" as Orientation },
  })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex w-full touch-none items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2 text-left transition-all duration-150",
        "hover:border-primary/50 hover:bg-muted active:scale-[0.98]",
        isDragging && "opacity-40"
      )}
    >
      <div
        className="shrink-0"
        style={
          {
            "--cell": "22px",
            width: `calc(22px * ${length})`,
            height: "22px",
          } as CSSProperties
        }
      >
        <ShipPiece type={type} length={length} orientation="Horizontal" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{type}</span>
        <span className="text-xs text-muted-foreground">{length} cells</span>
      </div>
    </button>
  )
}

export function PlacementView() {
  const size = useGameStore((s) => s.game?.boardSize ?? 10)
  const submitPlacement = useGameStore((s) => s.submitPlacement)
  const loading = useGameStore((s) => s.loading)
  const error = useGameStore((s) => s.error)

  const [placed, setPlaced] = useState<PlacedShip[]>([])
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null)
  const segmentRef = useRef(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const remaining = FLEET.filter((m) => !placed.some((p) => p.type === m.type))
  const complete = placed.length === FLEET.length

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DragData
    setActiveDrag(data)

    const rect = event.active.rect.current.initial
    const pointer = event.activatorEvent as PointerEvent
    if (rect) {
      if (data.orientation === "Horizontal") {
        const cell = rect.width / data.length
        segmentRef.current = clamp(
          Math.floor((pointer.clientX - rect.left) / cell),
          0,
          data.length - 1
        )
      } else {
        const cell = rect.height / data.length
        segmentRef.current = clamp(
          Math.floor((pointer.clientY - rect.top) / cell),
          0,
          data.length - 1
        )
      }
    } else {
      segmentRef.current = 0
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const data = activeDrag
    setActiveDrag(null)
    const over = event.over
    if (!data || !over?.data.current) return

    const { x, y } = over.data.current as { x: number; y: number }
    const seg = segmentRef.current
    const head =
      data.orientation === "Horizontal"
        ? { x: x - seg, y }
        : { x, y: y - seg }

    const candidate = cellsFor(head, data.orientation, data.length)
    if (canPlace(candidate, placed, size, data.type)) {
      setPlaced((prev) => [
        ...prev.filter((p) => p.type !== data.type),
        { type: data.type, length: data.length, orientation: data.orientation, anchor: head },
      ])
    }
  }

  function rotate(type: ShipType) {
    setPlaced((prev) => {
      const ship = prev.find((p) => p.type === type)
      if (!ship) return prev
      const orientation: Orientation =
        ship.orientation === "Horizontal" ? "Vertical" : "Horizontal"
      const anchor = { ...ship.anchor }
      if (orientation === "Horizontal") anchor.x = clamp(anchor.x, 0, size - ship.length)
      else anchor.y = clamp(anchor.y, 0, size - ship.length)

      const candidate = cellsFor(anchor, orientation, ship.length)
      if (!canPlace(candidate, prev, size, type)) return prev
      return prev.map((p) => (p.type === type ? { ...p, orientation, anchor } : p))
    })
  }

  async function deploy() {
    const ships: ShipPlacement[] = placed.map((s) => ({
      shipType: s.type,
      orientation: s.orientation,
      cells: shipCells(s),
    }))
    try {
      await submitPlacement(ships)
    } catch {
      /* error surfaced via store */
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
        <div className="flex flex-col items-center gap-2">
          <BoardShell size={size} cell={PLACEMENT_CELL}>
            <DroppableGrid size={size} />
            {placed.map((ship) => (
              <PlacedShipPiece
                key={ship.type}
                ship={ship}
                valid={canPlace(shipCells(ship), placed, size, ship.type)}
                onRotate={rotate}
              />
            ))}
          </BoardShell>
          <p className="text-xs text-muted-foreground">
            Drag ships onto the grid · click a ship to rotate
          </p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold">Deploy your fleet</h2>
            <p className="text-sm text-muted-foreground">
              Position all five ships, then lock them in.
            </p>
          </div>

          <div className="space-y-2">
            {remaining.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                All ships placed. Ready when you are.
              </div>
            ) : (
              remaining.map((m) => (
                <DockShip key={m.type} type={m.type} length={m.length} />
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setPlaced(randomFleet(size))}
            >
              <DiceFive weight="bold" /> Random
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setPlaced([])}
              disabled={placed.length === 0}
            >
              <Trash weight="bold" /> Clear
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            size="lg"
            className="w-full"
            disabled={!complete || loading}
            onClick={deploy}
          >
            {loading ? "Deploying…" : "Ready for battle"}
          </Button>
          <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <ArrowsClockwise weight="bold" className="size-3.5" /> Tip: click a
            placed ship to rotate it
          </p>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag && (
          <div
            style={
              {
                "--cell": PLACEMENT_CELL,
                width:
                  activeDrag.orientation === "Horizontal"
                    ? `calc(var(--cell) * ${activeDrag.length})`
                    : "var(--cell)",
                height:
                  activeDrag.orientation === "Vertical"
                    ? `calc(var(--cell) * ${activeDrag.length})`
                    : "var(--cell)",
              } as CSSProperties
            }
          >
            <ShipPiece
              type={activeDrag.type}
              length={activeDrag.length}
              orientation={activeDrag.orientation}
              variant="dragging"
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
