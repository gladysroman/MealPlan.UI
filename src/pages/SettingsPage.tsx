import type { ReactNode } from 'react'
import { useCurrentUser } from '../auth/useCurrentUser'
import { useLogout } from '../auth/useLogout'
import { OUTLINE_BUTTON_CLASSES } from '../components/shared/buttonStyles'
import { useUserProfile } from '../users/useUserProfile'

const UNIT_OPTIONS = [
  { value: 'imperial', label: 'US (oz, cups)' },
  { value: 'metric', label: 'Metric (g, mL)' },
]

interface RowProps {
  label: string
  children: ReactNode
}

const Row = ({ label, children }: RowProps) => (
  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
    <dt className="font-bold">{label}</dt>
    <dd>{children}</dd>
  </div>
)

// TODO: Let the user choose their preferred unit of measurement. This is
// display-only for now. Selecting an option needs an API endpoint to save
// pref_units (there is only a read-only GET /users/{id}/profile today), then a
// mutation here that updates it and refreshes the cached profile.
const UnitChoice = ({ unit }: { unit: string }) => (
  <span className="flex overflow-hidden rounded-lg border border-pebble text-sm">
    {UNIT_OPTIONS.map((option) => {
      const isSelected = option.value === unit
      return (
        <span
          key={option.value}
          aria-current={isSelected ? 'true' : undefined}
          className={`px-3 py-1 not-first:border-l not-first:border-pebble ${isSelected ? 'bg-apricot-3 font-bold' : ''}`}
        >
          {option.label}
        </span>
      )
    })}
  </span>
)

const SettingsPage = () => {
  const { data: user } = useCurrentUser()
  const profile = useUserProfile(user?.user_id)
  const logout = useLogout()

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {profile.isPending ? (
        <p role="status">Loading your settings…</p>
      ) : profile.data ? (
        <dl className="divide-y divide-pebble rounded-2xl border border-pebble px-6">
          <Row label="User's Name">{profile.data.name}</Row>
          <Row label="Email Address">{profile.data.email}</Row>
          <Row label="Preferred Unit of Measurement">
            <UnitChoice unit={profile.data.pref_units} />
          </Row>
        </dl>
      ) : (
        <p role="alert" className="font-bold text-apricot-8">
          We couldn't load your settings. Please try again later.
        </p>
      )}

      <div className="space-y-3 text-center">
        {logout.isError && (
          <p role="alert" className="font-bold text-apricot-8">
            We couldn't sign you out. Please try again.
          </p>
        )}
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className={OUTLINE_BUTTON_CLASSES}
        >
          {logout.isPending ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
