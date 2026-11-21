import type { KeyboardEvent } from 'react'
import Logo from './Logo'
import TabButton from './shared/TabButton'
import {
  HOME_TAB_ID,
  TABS,
  panelElementId,
  tabElementId,
  type TabId,
} from './tabs'

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const nextTabIndex = (key: string, current: number): number | null => {
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % TABS.length
    case 'ArrowLeft':
      return (current - 1 + TABS.length) % TABS.length
    case 'Home':
      return 0
    case 'End':
      return TABS.length - 1
    default:
      return null
  }
}

const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = TABS.findIndex((tab) => tab.id === activeTab)
    const next = nextTabIndex(event.key, current)
    if (next === null) return

    event.preventDefault()
    const nextId = TABS[next].id
    onTabChange(nextId)
    document.getElementById(tabElementId(nextId))?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Main sections"
      onKeyDown={handleKeyDown}
      className="flex overflow-hidden rounded-2xl border border-pebble bg-deep-teal"
    >
      {TABS.map((tab) => (
        <TabButton
          key={tab.id}
          id={tabElementId(tab.id)}
          panelId={panelElementId(tab.id)}
          label={tab.label}
          isActive={tab.id === activeTab}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.id === HOME_TAB_ID ? (
            <Logo />
          ) : (
            <>
              <span className="text-xl sm:hidden">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </>
          )}
        </TabButton>
      ))}
    </div>
  )
}

export default TabBar
