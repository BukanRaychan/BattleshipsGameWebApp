import type { ApiResponse } from "@/types/game"

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5280"

export class ApiError extends Error {}

type RequestOptions = {
  method?: string
  json?: unknown
  playerToken?: string
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function extractError(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>
    if (typeof b.error === "string" && b.error) return b.error
    if (b.errors && typeof b.errors === "object") {
      const messages = Object.values(b.errors as Record<string, string[]>)
        .flat()
        .filter(Boolean)
      if (messages.length) return messages.join(" ")
    }
    if (typeof b.title === "string" && b.title) return b.title
    if (typeof b.message === "string" && b.message) return b.message
  }
  return `Request failed (${status})`
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.playerToken ? { "X-Player-Token": options.playerToken } : {}),
    },
    body: options.json !== undefined ? JSON.stringify(options.json) : undefined,
  })

  const text = await response.text()
  const body = text ? safeParse(text) : null

  if (!response.ok) {
    throw new ApiError(extractError(body, response.status))
  }

  const envelope = body as ApiResponse<T> | null
  if (envelope && typeof envelope.success === "boolean") {
    if (!envelope.success) {
      throw new ApiError(envelope.error ?? envelope.message)
    }
    return envelope.data as T
  }

  return body as T
}
