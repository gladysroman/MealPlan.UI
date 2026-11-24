import { afterEach, expect, test, vi } from 'vitest'
import { currentUserQueryKey, queryClient } from '../lib/queryClient'
import { ApiError } from './apiClient'
import { getCurrentUser, login, logout, type CurrentUser } from './auth'
import { mealPlanApi } from './clients'

const jordan: CurrentUser = {
  user_id: 'usr_001',
  name: 'Jordan Smith',
  email: 'jordan@email.com',
  pref_units: 'metric',
}

const respondWith = (response: Response) => {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
  queryClient.clear()
})

test('getCurrentUser returns the signed-in user and sends cookies', async () => {
  const fetchMock = respondWith(
    new Response(JSON.stringify(jordan), { status: 200 }),
  )

  await expect(getCurrentUser()).resolves.toEqual(jordan)
  expect(fetchMock.mock.calls[0][0]).toBe('/api/mealplan/auth/me')
  expect(fetchMock.mock.calls[0][1].credentials).toBe('include')
})

test('getCurrentUser returns null when nobody is signed in', async () => {
  respondWith(new Response(null, { status: 401 }))

  await expect(getCurrentUser()).resolves.toBeNull()
})

test('getCurrentUser rethrows errors other than 401', async () => {
  respondWith(new Response(null, { status: 500 }))

  await expect(getCurrentUser()).rejects.toBeInstanceOf(ApiError)
})

test('login posts the credentials and returns the user', async () => {
  const fetchMock = respondWith(
    new Response(JSON.stringify(jordan), { status: 200 }),
  )

  const user = await login({ email: 'jordan@email.com', password: 'secret' })

  expect(user).toEqual(jordan)
  expect(fetchMock.mock.calls[0][0]).toBe('/api/mealplan/auth/login')
  expect(fetchMock.mock.calls[0][1].method).toBe('POST')
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
    email: 'jordan@email.com',
    password: 'secret',
  })
  expect(fetchMock.mock.calls[0][1].credentials).toBe('include')
})

test('a failed login rejects with a 401 ApiError and does not expire the session', async () => {
  respondWith(
    new Response(JSON.stringify({ title: 'Invalid email or password.' }), {
      status: 401,
    }),
  )

  const error = await login({ email: 'a@b.c', password: 'nope' }).catch(
    (e: unknown) => e,
  )

  expect((error as ApiError).status).toBe(401)
  expect(queryClient.getQueryData(currentUserQueryKey)).toBeUndefined()
})

test('logout posts to /auth/logout and tolerates the empty response', async () => {
  const fetchMock = respondWith(new Response(null, { status: 204 }))

  await expect(logout()).resolves.toBeUndefined()
  expect(fetchMock.mock.calls[0][0]).toBe('/api/mealplan/auth/logout')
  expect(fetchMock.mock.calls[0][1].method).toBe('POST')
})

test('a 401 from the MealPlan data client marks nobody as signed in', async () => {
  queryClient.setQueryData(currentUserQueryKey, jordan)
  respondWith(new Response(null, { status: 401 }))

  await mealPlanApi.get('/users/usr_001/meals').catch(() => undefined)

  expect(queryClient.getQueryData(currentUserQueryKey)).toBeNull()
})
