import { ApiError } from './apiClient'
import { authApi } from './clients'

// Field names match the API's JSON.
export interface CurrentUser {
  user_id: string
  name: string
  email: string
  pref_units: string
}

export interface LoginRequest {
  email: string
  password: string
}

// Resolves to the signed-in user, or null when nobody is signed in.
export const getCurrentUser = async (
  signal?: AbortSignal,
): Promise<CurrentUser | null> => {
  try {
    return await authApi.get<CurrentUser>('/auth/me', signal)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

// Rejects with an ApiError (status 401) when the email or password is wrong.
export const login = (request: LoginRequest): Promise<CurrentUser> =>
  authApi.post<CurrentUser>('/auth/login', request)

export const logout = (): Promise<void> =>
  authApi.post<void>('/auth/logout', undefined)
