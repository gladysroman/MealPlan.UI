import type { ReactNode } from 'react'

interface TabButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
  children: ReactNode
}

const BUTTON_CLASSES =
  'group flex-1 cursor-pointer px-2 py-4 text-base text-cream focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-apricot-3'

const UNDERLINE_CLASSES = 'inline-block border-b-3 pb-1 transition-colors'
const UNDERLINE_ACTIVE = 'border-apricot-5'
const UNDERLINE_INACTIVE = 'border-transparent group-hover:border-apricot-3'

const TabButton = ({ label, isActive, onClick, children }: TabButtonProps) => {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={BUTTON_CLASSES}
    >
      <span
        aria-hidden="true"
        className={`${UNDERLINE_CLASSES} ${isActive ? UNDERLINE_ACTIVE : UNDERLINE_INACTIVE}`}
      >
        {children}
      </span>
    </button>
  )
}

export default TabButton
