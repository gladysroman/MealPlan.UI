import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-cream text-espresso">
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <Link to="/" className="text-ocean underline hover:text-deep-teal">
          Back to home
        </Link>
      </main>
    </div>
  )
}

export default NotFoundPage
