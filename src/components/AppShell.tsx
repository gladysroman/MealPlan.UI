import { useState, type ComponentType } from 'react'
import { useCurrentUser } from '../hooks'
import ExplorePage from '../pages/ExplorePage'
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import ThisWeekPage from '../pages/ThisWeekPage'
import TabBar from './TabBar'
import {
  defaultTabId,
  panelElementId,
  tabElementId,
  visibleTabs,
  type TabDefinition,
  type TabId,
} from './tabs'

const PAGES: Record<TabId, ComponentType> = {
  home: HomePage,
  'this-week': ThisWeekPage,
  explore: ExplorePage,
  profile: ProfilePage,
  settings: SettingsPage,
}

type TabbedAppProps = {
  tabs: readonly TabDefinition[]
  initialTab: TabId
}

const TabbedApp = ({ tabs, initialTab }: TabbedAppProps) => {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  return (
    <div className="min-h-screen bg-cream text-espresso">
      <header className="mx-auto max-w-5xl px-4 pt-4">
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Visible panels stay mounted so page state survives tab switches. */}
        {tabs.map(({ id }) => {
          const Page = PAGES[id]
          return (
            <div
              key={id}
              role="tabpanel"
              id={panelElementId(id)}
              aria-labelledby={tabElementId(id)}
              hidden={id !== activeTab}
              tabIndex={0}
            >
              <Page />
            </div>
          )
        })}
      </main>
    </div>
  )
}

const AppShell = () => {
  const { data: user, isPending } = useCurrentUser()

  if (isPending) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-cream text-espresso"
      >
        Loading…
      </div>
    )
  }

  // If the sign-in check fails (for example the API is down), show the signed-out view.
  const signedIn = Boolean(user)

  // The key remounts the tabs when sign-in state changes, so the new state
  // starts on its own default tab.
  return (
    <TabbedApp
      key={signedIn ? 'signed-in' : 'signed-out'}
      tabs={visibleTabs(signedIn)}
      initialTab={defaultTabId(signedIn)}
    />
  )
}

export default AppShell
