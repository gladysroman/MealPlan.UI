export type Tab = {
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

export type TabDefinition = (typeof TABS)[number]

const SIGNED_OUT_TAB_IDS: readonly TabId[] = [HOME_TAB_ID, 'explore']

const SIGNED_IN_DEFAULT_TAB_ID = 'this-week' satisfies TabId

export const visibleTabs = (signedIn: boolean): readonly TabDefinition[] =>
  signedIn ? TABS : TABS.filter((tab) => SIGNED_OUT_TAB_IDS.includes(tab.id))

export const defaultTabId = (signedIn: boolean): TabId =>
  signedIn ? SIGNED_IN_DEFAULT_TAB_ID : HOME_TAB_ID

export const tabElementId = (id: TabId) => `tab-${id}`
export const panelElementId = (id: TabId) => `panel-${id}`
