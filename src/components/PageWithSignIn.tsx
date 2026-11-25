import { useState } from 'react'
import SignInButton from './SignInButton'
import SignInForm from './SignInForm'

type PageWithSignInProps = {
  title: string
}

// A page that signed-out visitors can see: its heading plus a Sign In button
// that swaps the page for the sign-in form until they sign in or cancel.
const PageWithSignIn = ({ title }: PageWithSignInProps) => {
  const [isSigningIn, setIsSigningIn] = useState(false)

  if (isSigningIn) return <SignInForm onCancel={() => setIsSigningIn(false)} />

  return (
    <div className="flex items-start justify-between gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <SignInButton onClick={() => setIsSigningIn(true)} />
    </div>
  )
}

export default PageWithSignIn
