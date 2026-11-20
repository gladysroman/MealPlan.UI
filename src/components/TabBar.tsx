import Logo, { LogoMark } from './Logo'
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
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTab}
          aria-label={tab.label}
          title={tab.label}
          onClick={() => onTabChange(tab.id as TabId)}
          className="group flex-1 cursor-pointer px-2 py-4 text-base text-cream focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-apricot-3"
        >
          <span
            aria-hidden="true"
            className={`inline-block border-b-3 pb-1 transition-colors ${
              tab.id === activeTab
                ? 'border-apricot-5'
                : 'border-transparent group-hover:border-apricot-3'
            }`}
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
          </span>
        </button>
      ))}
    </div>
  )
}

export default TabBar
