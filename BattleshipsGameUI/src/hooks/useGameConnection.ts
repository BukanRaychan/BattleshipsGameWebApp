import { useEffect, useState } from "react"
import {
  HubConnectionBuilder,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr"
import { API_BASE_URL } from "@/services/api"
import { useGameStore } from "@/store/gameStore"
import type { AttackResult } from "@/types/game"

type AttackMadePayload = {
  attackingPlayerId: string
  x: number
  y: number
  result: AttackResult
  currentTurnPlayerId: string
  isGameOver: boolean
}

/**
 * Opens the SignalR channel for a player and wires server pushes to the store.
 * Every event triggers an authoritative refresh; AttackMade also records the
 * shot so the board can animate it. This is the web-native replacement for the
 * console app's MessageDelegate.
 */
export function useGameConnection(playerToken: string | undefined): {
  connected: boolean
} {
  const [connected, setConnected] = useState(false)
  const refresh = useGameStore((s) => s.refresh)
  const registerShot = useGameStore((s) => s.registerShot)

  useEffect(() => {
    if (!playerToken) return

    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(
        `${API_BASE_URL}/hubs/game?playerToken=${encodeURIComponent(playerToken)}`
      )
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connection.on("PlayerJoined", () => void refresh())
    connection.on("PhaseChanged", () => void refresh())
    connection.on("GameOver", () => void refresh())
    connection.on("AttackMade", (payload: AttackMadePayload) => {
      registerShot(payload.x, payload.y, payload.result, payload.attackingPlayerId)
    })

    connection.onreconnecting(() => setConnected(false))
    connection.onreconnected(() => {
      setConnected(true)
      void refresh()
    })
    connection.onclose(() => setConnected(false))

    let cancelled = false
    connection
      .start()
      .then(() => {
        if (cancelled) return
        setConnected(true)
        void refresh()
      })
      .catch(() => setConnected(false))

    return () => {
      cancelled = true
      void connection.stop()
    }
  }, [playerToken, refresh, registerShot])

  return { connected }
}
