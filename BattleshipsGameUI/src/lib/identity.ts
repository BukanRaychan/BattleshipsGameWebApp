import type { Identity } from "@/types/game"

const KEY = "bs-identity"

export function saveIdentity(identity: Identity): void {
  sessionStorage.setItem(KEY, JSON.stringify(identity))
}

export function loadIdentity(): Identity | null {
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Identity
  } catch {
    return null
  }
}

export function clearIdentity(): void {
  sessionStorage.removeItem(KEY)
}
