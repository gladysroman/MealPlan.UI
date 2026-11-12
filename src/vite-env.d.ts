/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the MealPlan API. Defaults to the dev proxy path. */
  readonly VITE_MEALPLAN_API_URL?: string
  /** Base URL of the Ingredients API. Defaults to the dev proxy path. */
  readonly VITE_INGREDIENTS_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
