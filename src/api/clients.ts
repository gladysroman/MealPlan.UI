import { expireSession } from '../lib/queryClient'
import { createApiClient } from './apiClient'

// Defaults are the dev-server proxy paths configured in vite.config.ts.
const MEALPLAN_API_URL =
  import.meta.env.VITE_MEALPLAN_API_URL ?? '/api/mealplan'

// For the sign-in endpoints (/auth/*). It has no onUnauthorized handler on
// purpose: a 401 here is an expected answer (wrong password, or nobody signed
// in yet), not a session that expired.
export const authApi = createApiClient(MEALPLAN_API_URL, {
  credentials: 'include',
})

// For everything else on the MealPlan API. A 401 here means the session is gone.
export const mealPlanApi = createApiClient(MEALPLAN_API_URL, {
  credentials: 'include',
  onUnauthorized: expireSession,
})

// Reading ingredients is public, but changing them needs the MealPlan sign-in
// cookie, which the Ingredients API also accepts. A 401 here means the session
// is gone.
export const ingredientsApi = createApiClient(
  import.meta.env.VITE_INGREDIENTS_API_URL ?? '/api/ingredients',
  {
    credentials: 'include',
    onUnauthorized: expireSession,
  },
)
