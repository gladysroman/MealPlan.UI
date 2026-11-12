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

export const createApiClient = (baseUrl: string): ApiClient => {
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
      signal,
    })

    const text = await response.text()
    const data: unknown = text ? JSON.parse(text) : undefined

    if (!response.ok) {
      throw new ApiError(response.status, data)
    }
    return data as T
  }

  return {
    get: (path, signal) => request('GET', path, undefined, signal),
    post: (path, body, signal) => request('POST', path, body, signal),
    put: (path, body, signal) => request('PUT', path, body, signal),
    delete: (path, signal) => request<void>('DELETE', path, undefined, signal),
  }
}
