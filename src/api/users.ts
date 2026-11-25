import { mealPlanApi } from './clients'

// Field names match the API's JSON.
export type UserProfile = {
  name: string
  email: string
  pref_units: string
}

// Resolves to null when the API has no such user (it answers 204 No Content).
export const getUserProfile = async (
  userId: string,
  signal?: AbortSignal,
): Promise<UserProfile | null> => {
  const profile = await mealPlanApi.get<UserProfile | undefined>(
    `/users/${encodeURIComponent(userId)}/profile`,
    signal,
  )
  return profile ?? null
}
