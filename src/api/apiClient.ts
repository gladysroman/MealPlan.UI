export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`API request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export interface ApiClient {
  get<T>(path: string, signal?: AbortSignal): Promise<T>
  post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T>
  put<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T>
  delete(path: string, signal?: AbortSignal): Promise<void>
}

export interface ApiClientOptions {
  // Whether requests carry cookies. Use 'include' for the MealPlan API, whose
  // sign-in cookie must be sent even when the API is on another origin.
  credentials?: RequestCredentials
  // Called when any response is 401, just before the ApiError is thrown.
  onUnauthorized?: () => void
}

// Error responses are not always JSON (a server's plain-text stack trace, a
// proxy's HTML error page). Those are kept as text so the status still reaches
// the caller as an ApiError.
const parseErrorBody = (text: string): unknown => {
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const createApiClient = (
  baseUrl: string,
  options: ApiClientOptions = {},
): ApiClient => {
  const request = async <T>(
    method: string,
    path: string,
    body?: unknown,
    signal?: AbortSignal,
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: options.credentials,
      signal,
    })

    const text = await response.text()

    if (!response.ok) {
      if (response.status === 401) {
        options.onUnauthorized?.()
      }
      throw new ApiError(response.status, parseErrorBody(text))
    }
    return (text ? JSON.parse(text) : undefined) as T
  }

  return {
    get: (path, signal) => request('GET', path, undefined, signal),
    post: (path, body, signal) => request('POST', path, body, signal),
    put: (path, body, signal) => request('PUT', path, body, signal),
    delete: (path, signal) => request<void>('DELETE', path, undefined, signal),
  }
}
