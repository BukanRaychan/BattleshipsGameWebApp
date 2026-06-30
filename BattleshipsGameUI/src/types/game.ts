export type GameStatus =
  | "WaitingForPlayers"
  | "Placement"
  | "InProgress"
  | "Finished"

export type Orientation = "Horizontal" | "Vertical"

export type AttackResult = "Hit" | "Miss" | "Sunk"

export type ShipType =
  | "Carrier"
  | "Battleship"
  | "Cruiser"
  | "Submarine"
  | "Destroyer"

export type Coordinate = { x: number; y: number }

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T | null
  error?: string | null
}

export type CreateGameResponse = {
  sessionId: string
  playerId: string
  joinCode: string
  playerToken: string
}

export type JoinGameResponse = {
  sessionId: string
  playerId: string
  playerToken: string
}

export type ShipView = {
  shipType: ShipType
  orientation: Orientation
  isSunk: boolean
  cells: Coordinate[]
}

export type Shot = {
  x: number
  y: number
  result: AttackResult
}

export type BoardView = {
  size: number
  ships: ShipView[]
  shots: Shot[]
}

export type GameState = {
  sessionId: string
  status: GameStatus
  boardSize: number
  ownBoard: BoardView
  opponentBoard: BoardView
  currentTurnPlayerId: string | null
  yourTurn: boolean
  winnerPlayerId: string | null
}

export type AttackResponse = {
  target: Coordinate
  result: AttackResult
  isGameOver: boolean
  winnerPlayerId: string | null
  currentTurnPlayerId: string
}

/** Payload sent to POST /placement */
export type ShipPlacement = {
  shipType: ShipType
  orientation: Orientation
  cells: Coordinate[]
}

/** The identity we persist per tab so a refresh resumes the same player. */
export type Identity = {
  sessionId: string
  playerId: string
  playerToken: string
  playerName: string
  joinCode?: string
}
