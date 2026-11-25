import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, expect, test, vi } from 'vitest'
import App from './App'
import type { CurrentUser } from './api/auth'

const jordan: CurrentUser = {
  user_id: 'usr_001',
  name: 'Jordan Smith',
  email: 'jordan@email.com',
  pref_units: 'metric',
}

type Responder = () => Response | Promise<Response>

type ApiStub = {
  user?: CurrentUser | null
  // Override the answer to a call; each has a success answer by default.
  login?: Responder
  logout?: Responder
  profile?: Responder
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

// A stand-in for the MealPlan API that remembers who is signed in: a successful
// login signs Jordan in and a successful logout signs everyone out. Calls that
// need a signed-in user answer 401 when nobody is.
const stubApi = ({ user = null, login, logout, profile }: ApiStub = {}) => {
  let current = user
  const fetchMock = vi.fn().mockImplementation(async (url: string) => {
    if (url.endsWith('/auth/login')) {
      const response = await (login?.() ?? json(jordan))
      if (response.ok) current = jordan
      return response
    }
    if (url.endsWith('/auth/logout')) {
      const response = await (logout?.() ?? new Response(null, { status: 204 }))
      if (response.ok) current = null
      return response
    }
    if (!current) return new Response(null, { status: 401 })
    if (url.endsWith('/profile')) {
      return (
        profile?.() ??
        json({
          name: current.name,
          email: current.email,
          pref_units: current.pref_units,
        })
      )
    }
    return json(current)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const stubSignedInAs = (user: CurrentUser | null) => stubApi({ user })

const stubLogin = (login: Responder) => stubApi({ login })

const loginSucceeds = () => json(jordan)

const fillAndSubmit = (email: string, password: string) => {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: password },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
}

const renderAt = (path: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const tab = (name: string) => screen.getByRole('tab', { name })

afterEach(() => {
  vi.unstubAllGlobals()
})

test('renders the not-found page for unknown routes', () => {
  stubSignedInAs(null)
  renderAt('/nope')
  expect(
    screen.getByRole('heading', { name: 'Page not found' }),
  ).toBeInTheDocument()
})

test('shows a loading state until the sign-in check finishes', async () => {
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
  renderAt('/')

  expect(screen.getByRole('status')).toHaveTextContent('Loading')
  expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
})

test('signed out: only the MealPlan and Explore tabs, starting on MealPlan', async () => {
  stubSignedInAs(null)
  renderAt('/')
  await screen.findByRole('tablist')

  expect(
    screen.getAllByRole('tab').map((t) => t.getAttribute('aria-label')),
  ).toEqual(['MealPlan', 'Explore'])
  expect(tab('MealPlan')).toHaveAttribute('aria-selected', 'true')
  expect(
    screen.getByRole('heading', { level: 1, name: 'MealPlan' }),
  ).toBeInTheDocument()
})

test('signed out: both tabs show a Sign In button', async () => {
  stubSignedInAs(null)
  renderAt('/')
  await screen.findByRole('tablist')

  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()

  fireEvent.click(tab('Explore'))
  expect(
    screen.getByRole('heading', { level: 1, name: 'Explore' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
})

test('signed out: arrow keys cycle through the two tabs', async () => {
  stubSignedInAs(null)
  renderAt('/')
  const tablist = await screen.findByRole('tablist')

  fireEvent.keyDown(tablist, { key: 'ArrowRight' })
  expect(tab('Explore')).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'ArrowRight' })
  expect(tab('MealPlan')).toHaveFocus()
})

test('signed in: all five tabs, starting on This Week', async () => {
  stubSignedInAs(jordan)
  renderAt('/')
  await screen.findByRole('tablist')

  expect(
    screen.getAllByRole('tab').map((t) => t.getAttribute('aria-label')),
  ).toEqual(['MealPlan', 'This Week', 'Explore', 'Profile', 'Settings'])
  expect(tab('This Week')).toHaveAttribute('aria-selected', 'true')
  expect(
    screen.getByRole('heading', { level: 1, name: 'This Week' }),
  ).toBeInTheDocument()
})

test('signed in: no Sign In button, and tabs switch on click', async () => {
  stubSignedInAs(jordan)
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('MealPlan'))
  expect(
    screen.getByRole('heading', { level: 1, name: 'MealPlan' }),
  ).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Sign In' })).toBeNull()

  fireEvent.click(tab('Explore'))
  expect(screen.queryByRole('button', { name: 'Sign In' })).toBeNull()
})

test('signed in: moves between tabs with arrow, Home and End keys', async () => {
  stubSignedInAs(jordan)
  renderAt('/')
  const tablist = await screen.findByRole('tablist')

  fireEvent.keyDown(tablist, { key: 'ArrowRight' })
  expect(tab('Explore')).toHaveAttribute('aria-selected', 'true')
  expect(tab('Explore')).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'End' })
  expect(tab('Settings')).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'ArrowRight' })
  expect(tab('MealPlan')).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'ArrowLeft' })
  expect(tab('Settings')).toHaveFocus()

  fireEvent.keyDown(tablist, { key: 'Home' })
  expect(tab('MealPlan')).toHaveFocus()
})

test('only the active tab is in the tab order and each tab controls its panel', async () => {
  stubSignedInAs(jordan)
  renderAt('/')
  await screen.findByRole('tablist')

  const tabs = screen.getAllByRole('tab')
  expect(tabs.filter((t) => t.tabIndex === 0)).toHaveLength(1)

  const active = screen.getByRole('tab', { selected: true })
  const panel = screen.getByRole('tabpanel')
  expect(active).toHaveAttribute('aria-controls', panel.id)
  expect(panel).toHaveAttribute('aria-labelledby', active.id)
})

test('clicking Sign In replaces the tab content with the sign-in form', async () => {
  stubSignedInAs(null)
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

  expect(
    screen.getByRole('heading', { level: 1, name: 'Sign In' }),
  ).toBeInTheDocument()
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
  expect(screen.getByLabelText('Password')).toBeInTheDocument()
  expect(
    screen.queryByRole('heading', { level: 1, name: 'MealPlan' }),
  ).toBeNull()
  expect(screen.getAllByRole('tab')).toHaveLength(2)
})

test('the sign-in form opens inside whichever tab the user is on', async () => {
  stubSignedInAs(null)
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Explore'))
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  expect(
    screen.getByRole('heading', { level: 1, name: 'Sign In' }),
  ).toBeInTheDocument()
  expect(tab('Explore')).toHaveAttribute('aria-selected', 'true')

  fireEvent.click(tab('MealPlan'))
  expect(
    screen.getByRole('heading', { level: 1, name: 'MealPlan' }),
  ).toBeInTheDocument()
})

test('Cancel closes the sign-in form and brings the tab content back', async () => {
  stubSignedInAs(null)
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

  expect(
    screen.getByRole('heading', { level: 1, name: 'MealPlan' }),
  ).toBeInTheDocument()
  expect(screen.queryByLabelText('Email')).toBeNull()
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
})

test('sign-in forms open in two tabs keep their own labelled fields', async () => {
  stubSignedInAs(null)
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  fireEvent.click(tab('Explore'))
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

  // Both forms stay mounted (the MealPlan tab's is hidden), one field each.
  const emails = screen.getAllByLabelText('Email')
  const passwords = screen.getAllByLabelText('Password')
  expect(emails).toHaveLength(2)
  expect(passwords).toHaveLength(2)
  expect(new Set([...emails, ...passwords].map((el) => el.id)).size).toBe(4)
})

test('signing in switches to the signed-in view on This Week', async () => {
  const fetchMock = stubLogin(loginSucceeds)
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  fillAndSubmit('jordan@email.com', 'secret')

  await waitFor(() =>
    expect(tab('This Week')).toHaveAttribute('aria-selected', 'true'),
  )
  expect(screen.getAllByRole('tab')).toHaveLength(5)
  expect(screen.queryByLabelText('Email')).toBeNull()

  const loginCall = fetchMock.mock.calls.find(([url]) =>
    String(url).endsWith('/auth/login'),
  )!
  expect(JSON.parse(loginCall[1].body)).toEqual({
    email: 'jordan@email.com',
    password: 'secret',
  })
})

test('a wrong password shows an error, keeps the email and clears the password', async () => {
  stubLogin(
    () =>
      new Response(JSON.stringify({ title: 'Invalid email or password.' }), {
        status: 401,
      }),
  )
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  fillAndSubmit('jordan@email.com', 'wrong')

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Invalid email or password.',
  )
  expect(screen.getByLabelText('Email')).toHaveValue('jordan@email.com')
  expect(screen.getByLabelText('Password')).toHaveValue('')
  expect(screen.getAllByRole('tab')).toHaveLength(2)
})

test('other failures show a generic error', async () => {
  stubLogin(() => new Response(null, { status: 500 }))
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  fillAndSubmit('jordan@email.com', 'secret')

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Something went wrong. Please try again.',
  )
})

test('the form button is disabled while signing in', async () => {
  stubLogin(() => new Promise<Response>(() => {}))
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))
  fillAndSubmit('jordan@email.com', 'secret')

  expect(
    await screen.findByRole('button', { name: 'Signing in…' }),
  ).toBeDisabled()
})

test('Settings shows the profile details and the preferred unit', async () => {
  const fetchMock = stubApi({ user: jordan })
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Settings'))

  expect(await screen.findByText('Jordan Smith')).toBeInTheDocument()
  expect(screen.getByText('jordan@email.com')).toBeInTheDocument()
  expect(screen.getByText("User's Name")).toBeInTheDocument()
  expect(screen.getByText('Email Address')).toBeInTheDocument()
  expect(screen.getByText('Preferred Unit of Measurement')).toBeInTheDocument()
  expect(screen.getByText('Metric (g, mL)')).toHaveAttribute(
    'aria-current',
    'true',
  )
  expect(screen.getByText('US (oz, cups)')).not.toHaveAttribute('aria-current')

  const profileCall = fetchMock.mock.calls.find(([url]) =>
    String(url).endsWith('/profile'),
  )!
  expect(profileCall[0]).toBe('/api/mealplan/users/usr_001/profile')
  expect(profileCall[1].credentials).toBe('include')
})

test('Settings marks US units when that is the preference', async () => {
  stubApi({ user: { ...jordan, pref_units: 'imperial' } })
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Settings'))

  expect(await screen.findByText('US (oz, cups)')).toHaveAttribute(
    'aria-current',
    'true',
  )
  expect(screen.getByText('Metric (g, mL)')).not.toHaveAttribute('aria-current')
})

test('Settings explains when the profile cannot be loaded and still offers Sign Out', async () => {
  stubApi({ user: jordan, profile: () => new Response(null, { status: 500 }) })
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Settings'))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    "We couldn't load your settings",
  )
  expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument()
})

test('Settings explains when the API has no profile for the user', async () => {
  stubApi({ user: jordan, profile: () => new Response(null, { status: 204 }) })
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Settings'))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    "We couldn't load your settings",
  )
})

test('Sign Out returns to the signed-out view on the MealPlan tab', async () => {
  const fetchMock = stubApi({ user: jordan })
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Settings'))
  fireEvent.click(await screen.findByRole('button', { name: 'Sign Out' }))

  await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(2))
  expect(tab('MealPlan')).toHaveAttribute('aria-selected', 'true')
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  // The previous user's details are gone.
  expect(screen.queryByText('jordan@email.com')).toBeNull()

  const logoutCall = fetchMock.mock.calls.find(([url]) =>
    String(url).endsWith('/auth/logout'),
  )!
  expect(logoutCall[1].method).toBe('POST')
  expect(logoutCall[1].credentials).toBe('include')
})

test('a failed Sign Out says so and keeps the user signed in', async () => {
  stubApi({ user: jordan, logout: () => new Response(null, { status: 500 }) })
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Settings'))
  fireEvent.click(await screen.findByRole('button', { name: 'Sign Out' }))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    "We couldn't sign you out",
  )
  expect(screen.getAllByRole('tab')).toHaveLength(5)
})

test('the Sign Out button is disabled while signing out', async () => {
  stubApi({ user: jordan, logout: () => new Promise<Response>(() => {}) })
  renderAt('/')
  await screen.findByRole('tablist')

  fireEvent.click(tab('Settings'))
  fireEvent.click(await screen.findByRole('button', { name: 'Sign Out' }))

  expect(
    await screen.findByRole('button', { name: 'Signing out…' }),
  ).toBeDisabled()
})
