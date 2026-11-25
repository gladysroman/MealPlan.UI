import { useId, useState, type FormEvent } from 'react'
import { ApiError } from '../api/apiClient'
import { useLogin } from '../hooks/useLogin'
import {
  OUTLINE_BUTTON_CLASSES,
  PRIMARY_BUTTON_CLASSES,
} from './shared/buttonStyles'

const LABEL_CLASSES = 'block text-sm font-bold text-deep-teal'

const INPUT_CLASSES =
  'w-full rounded-xl border border-pebble bg-cream px-4 py-2.5 text-espresso transition-colors hover:border-lagoon focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-apricot-5'

const errorMessage = (error: unknown) =>
  error instanceof ApiError && error.status === 401
    ? 'Invalid email or password.'
    : 'Something went wrong. Please try again.'

// Replaces a tab's content while someone signs in. On success the app
// switches to the signed-in view, so there is nothing to do here afterwards.
type SignInFormProps = {
  onCancel: () => void
}

const SignInForm = ({ onCancel }: SignInFormProps) => {
  // Several tabs can each have a form mounted at once, so ids must be per-form.
  const emailId = useId()
  const passwordId = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, error } = useLogin()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutate(
      { email, password },
      // Keep the email for another try, but never leave a rejected password behind.
      { onError: () => setPassword('') },
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-pebble bg-white shadow-sm"
    >
      <div className="bg-ocean px-6 py-4 text-center">
        <h1 className="text-xl font-bold text-cream">Sign In</h1>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <label htmlFor={emailId} className={LABEL_CLASSES}>
            Email
          </label>
          <input
            id={emailId}
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={INPUT_CLASSES}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={passwordId} className={LABEL_CLASSES}>
            Password
          </label>
          <input
            id={passwordId}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={INPUT_CLASSES}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-apricot-4 bg-apricot-1 px-4 py-3 text-center text-sm font-bold text-apricot-9"
          >
            {errorMessage(error)}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`w-full ${PRIMARY_BUTTON_CLASSES}`}
        >
          {isPending ? 'Signing in…' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className={`w-full ${OUTLINE_BUTTON_CLASSES}`}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default SignInForm
