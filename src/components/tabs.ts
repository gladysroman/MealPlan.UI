export interface Tab {
  id: string
  label: string
  icon?: string
}

export const TABS = [
  { id: 'home', label: 'MealPlan' },
  { id: 'this-week', label: 'This Week', icon: '📅' },
  { id: 'explore', label: 'Explore', icon: '🔍' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
] as const satisfies readonly Tab[]

export type TabId = (typeof TABS)[number]['id']

// The home tab is the default and the one that shows the logo.
export const HOME_TAB_ID = 'home' satisfies TabId

export const tabElementId = (id: TabId) => `tab-${id}`
export const panelElementId = (id: TabId) => `panel-${id}`
