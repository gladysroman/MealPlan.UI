import { createApiClient } from './apiClient'

// Defaults are the dev-server proxy paths configured in vite.config.ts.
export const mealPlanApi = createApiClient(
  import.meta.env.VITE_MEALPLAN_API_URL ?? '/api/mealplan',
)

export const ingredientsApi = createApiClient(
  import.meta.env.VITE_INGREDIENTS_API_URL ?? '/api/ingredients',
)
