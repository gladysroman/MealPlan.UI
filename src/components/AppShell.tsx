import { useState, type ComponentType } from 'react'
import ExplorePage from '../pages/ExplorePage'
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import ThisWeekPage from '../pages/ThisWeekPage'
import TabBar from './TabBar'
import {
  HOME_TAB_ID,
  TABS,
  panelElementId,
  tabElementId,
  type TabId,
} from './tabs'

const PAGES: Record<TabId, ComponentType> = {
  home: HomePage,
  'this-week': ThisWeekPage,
  explore: ExplorePage,
  profile: ProfilePage,
  settings: SettingsPage,
}

const AppShell = () => {
  const [activeTab, setActiveTab] = useState<TabId>(HOME_TAB_ID)

  return (
    <div className="min-h-screen bg-cream text-espresso">
      <header className="mx-auto max-w-5xl px-4 pt-4">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* All panels stay mounted so page state survives tab switches. */}
        {TABS.map(({ id }) => {
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

export default AppShell
