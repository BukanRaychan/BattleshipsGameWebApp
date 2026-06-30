import { apiFetch } from "@/services/api"
import type {
  AttackResponse,
  CreateGameResponse,
  GameState,
  JoinGameResponse,
  ShipPlacement,
} from "@/types/game"

export function createGame(
  playerName: string,
  boardSize = 10
): Promise<CreateGameResponse> {
  return apiFetch<CreateGameResponse>("/api/game", {
    method: "POST",
    json: { playerName, boardSize },
  })
}

export function joinGame(
  joinCode: string,
  playerName: string
): Promise<JoinGameResponse> {
  return apiFetch<JoinGameResponse>(
    `/api/game/${encodeURIComponent(joinCode)}/join`,
    {
      method: "POST",
      json: { playerName },
    }
  )
}

export function placeFleet(
  sessionId: string,
  playerToken: string,
  ships: ShipPlacement[]
): Promise<GameState> {
  return apiFetch<GameState>(`/api/game/${sessionId}/placement`, {
    method: "POST",
    playerToken,
    json: { ships },
  })
}

export function attack(
  sessionId: string,
  playerToken: string,
  x: number,
  y: number
): Promise<AttackResponse> {
  return apiFetch<AttackResponse>(`/api/game/${sessionId}/attack`, {
    method: "POST",
    playerToken,
    json: { x, y },
  })
}

export function getState(
  sessionId: string,
  playerToken: string
): Promise<GameState> {
  return apiFetch<GameState>(`/api/game/${sessionId}`, { playerToken })
}
