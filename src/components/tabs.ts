export interface Tab {
  id: string
  label: string
  // Shown instead of the label on narrow screens. Omitted for the logo tab,
  // which renders the logo mark instead.
  icon?: string
}

export const TABS = [
  { id: 'meal-tracker', label: 'MealPlan' },
  { id: 'this-week', label: 'This Week', icon: '📅' },
  { id: 'explore', label: 'Explore', icon: '🔍' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
] as const

export type TabId = (typeof TABS)[number]['id']

export const DEFAULT_TAB: TabId = 'meal-tracker'

// The same list, widened to Tab so optional fields like `icon` can be read.
export const TAB_LIST: readonly Tab[] = TABS

// The tab that shows the logo instead of a text label.
export const LOGO_TAB_ID: TabId = 'meal-tracker'
