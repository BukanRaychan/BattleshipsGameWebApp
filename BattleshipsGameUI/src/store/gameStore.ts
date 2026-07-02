import { create } from "zustand"
import { attack, getState, placeFleet } from "@/services/gameService"
import { ApiError } from "@/services/api"
import { clearIdentity, saveIdentity } from "@/lib/identity"
import type {
  AttackResult,
  GameState,
  Identity,
  ShipPlacement,
} from "@/types/game"

export type LastShot = {
  x: number
  y: number
  result: AttackResult
  byMe: boolean
  /** monotonically increasing so repeated shots at the same cell re-trigger */
  seq: number
}

type GameStore = {
  identity: Identity | null
  game: GameState | null
  loading: boolean
  error: string | null
  lastShot: LastShot | null

  setIdentity: (identity: Identity) => void
  refresh: () => Promise<void>
  submitPlacement: (ships: ShipPlacement[]) => Promise<void>
  fireAttack: (x: number, y: number) => Promise<void>
  registerShot: (
    x: number,
    y: number,
    result: AttackResult,
    attackingPlayerId: string
  ) => void
  clearError: () => void
  leave: () => void
}

let shotSeq = 0

export const useGameStore = create<GameStore>((set, get) => ({
  identity: null,
  game: null,
  loading: false,
  error: null,
  lastShot: null,

  setIdentity: (identity) => {
    saveIdentity(identity)
    set({ identity })
  },

  refresh: async () => {
    const { identity } = get()
    if (!identity) return
    try {
      const game = await getState(identity.sessionId, identity.playerToken)
      set({ game, error: null })
    } catch (err) {
      set({ error: err instanceof ApiError ? err.message : "Failed to load game" })
    }
  },

  submitPlacement: async (ships) => {
    const { identity } = get()
    if (!identity) return
    set({ loading: true, error: null })
    try {
      const game = await placeFleet(identity.sessionId, identity.playerToken, ships)
      set({ game, loading: false })
    } catch (err) {
      set({
        loading: false,
        error: err instanceof ApiError ? err.message : "Failed to place fleet",
      })
      throw err
    }
  },

  fireAttack: async (x, y) => {
    const { identity, game } = get()
    if (!identity || !game?.yourTurn) return
    try {
      const result = await attack(identity.sessionId, identity.playerToken, x, y)
      set({
        lastShot: { x, y, result: result.result, byMe: true, seq: ++shotSeq },
      })
      await get().refresh()
    } catch (err) {
      set({ error: err instanceof ApiError ? err.message : "Attack failed" })
    }
  },

  registerShot: (x, y, result, attackingPlayerId) => {
    const { identity } = get()
    const byMe = identity?.playerId === attackingPlayerId
    set({ lastShot: { x, y, result, byMe, seq: ++shotSeq } })
    void get().refresh()
  },

  clearError: () => set({ error: null }),

  leave: () => {
    clearIdentity()
    set({ identity: null, game: null, lastShot: null, error: null })
  },
}))
