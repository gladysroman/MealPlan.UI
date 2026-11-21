import Logo, { LogoMark } from './Logo'
import TabButton from './shared/TabButton'
import { LOGO_TAB_ID, TAB_LIST, type TabId } from './tabs'

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  return (
    <div
      role="tablist"
      aria-label="Main sections"
      className="flex overflow-hidden rounded-2xl border border-pebble bg-deep-teal"
    >
      {TAB_LIST.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          isActive={tab.id === activeTab}
          onClick={() => onTabChange(tab.id as TabId)}
        >
          {tab.id === LOGO_TAB_ID ? (
            <>
              <span className="flex sm:hidden">
                <LogoMark />
              </span>
              <span className="hidden sm:flex">
                <Logo />
              </span>
            </>
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
