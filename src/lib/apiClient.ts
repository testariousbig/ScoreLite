const API_BASE = '/api/football-data'

export type ApiError = {
  message: string
  status?: number
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    method: 'GET',
    headers: {
      ...(init?.headers ?? {}),
    },
  })

  const text = await res.text()
  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    if (isJson) {
      try {
        const data = JSON.parse(text) as { message?: string; error?: string }
        message = data.message ?? data.error ?? message
      } catch {
        // ignore
      }
    }
    const err: ApiError = { message, status: res.status }
    throw err
  }

  if (!isJson) {
    throw { message: 'Unexpected content-type', status: res.status } satisfies ApiError
  }

  return JSON.parse(text) as T
}

