export interface Tab {
  id: string
  label: string
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

export const TAB_LIST: readonly Tab[] = TABS

export const LOGO_TAB_ID: TabId = 'meal-tracker'
