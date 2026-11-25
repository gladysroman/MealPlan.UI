import { useCurrentUser } from '../hooks/useCurrentUser'
import { OUTLINE_BUTTON_CLASSES } from './shared/buttonStyles'

type SignInButtonProps = {
  onClick: () => void
}

const SignInButton = ({ onClick }: SignInButtonProps) => {
  const { data: user } = useCurrentUser()

  if (user) return null

  return (
    <button type="button" onClick={onClick} className={OUTLINE_BUTTON_CLASSES}>
      Sign In
    </button>
  )
}

export default SignInButton
