const LogoMark = () => {
  return (
    <svg
      width="23"
      height="20"
      viewBox="0 0 30 26"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1.5"
        width="28"
        height="23"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <rect
        x="5"
        y="5.5"
        width="10"
        height="15"
        rx="2.5"
        className="fill-apricot-5"
      />
      <rect
        x="18"
        y="5.5"
        width="8"
        height="6.5"
        rx="2"
        className="fill-lagoon"
      />
      <rect
        x="18"
        y="14"
        width="8"
        height="6.5"
        rx="2"
        className="fill-lagoon"
      />
    </svg>
  )
}

const Logo = () => {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="hidden sm:inline">
        Meal<span className="text-apricot-5">Plan</span>
      </span>
    </span>
  )
}

export default Logo
