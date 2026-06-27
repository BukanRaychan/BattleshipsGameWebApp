import type { ApiResponse } from "@/types/api"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5280"

const AUTH_STORAGE_KEY = "product-catalog-auth"

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return (JSON.parse(raw) as { token?: string }).token ?? null
  } catch {
    return null
  }
}

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  json?: unknown
  body?: BodyInit | null
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken()
  const init: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.json ? JSON.stringify(options.json) : options.body,
  }

  const response = await fetch(`${apiBaseUrl}${path}`, init)
  const text = await response.text()
  const decoded = text ? (JSON.parse(text) as ApiResponse<T>) : null

  if (!response.ok) {
    return {
      data: null,
      success: false,
      message:
        decoded?.message ?? `Request failed with status ${response.status}`,
      errors: decoded?.errors,
    }
  }

  return (
    decoded ?? {
      data: null,
      success: false,
      message: "Unexpected response format",
    }
  )
}
