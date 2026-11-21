import { useState } from 'react'
import ExplorePage from '../pages/ExplorePage'
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import ThisWeekPage from '../pages/ThisWeekPage'
import TabBar from './TabBar'
import { DEFAULT_TAB, type TabId } from './tabs'

const PAGES: Record<TabId, () => React.JSX.Element> = {
  'meal-tracker': HomePage,
  'this-week': ThisWeekPage,
  explore: ExplorePage,
  profile: ProfilePage,
  settings: SettingsPage,
}

const AppShell = () => {
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB)
  const ActivePage = PAGES[activeTab]

  return (
    <div className="min-h-screen bg-cream text-espresso">
      <header className="mx-auto max-w-5xl px-4 pt-4">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <ActivePage />
      </main>
    </div>
  )
}

export default AppShell
