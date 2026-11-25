import { afterEach, expect, test, vi } from 'vitest'
import { ApiError, createApiClient } from './apiClient'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('get returns parsed JSON', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ id: '1' }), { status: 200 }),
    )
  vi.stubGlobal('fetch', fetchMock)

  const result = await createApiClient('/api/x').get<{ id: string }>(
    '/things/1',
  )

  expect(result).toEqual({ id: '1' })
  expect(fetchMock.mock.calls[0][0]).toBe('/api/x/things/1')
})

test('non-2xx responses throw ApiError with status and body', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ title: 'bad' }), { status: 400 }),
      ),
  )

  const error = await createApiClient('/api/x')
    .get('/things')
    .catch((e: unknown) => e)

  expect(error).toBeInstanceOf(ApiError)
  expect((error as ApiError).status).toBe(400)
  expect((error as ApiError).body).toEqual({ title: 'bad' })
})

test('an error response that is not JSON still throws ApiError, with the text as body', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response('System.ArgumentNullException: boom', { status: 500 }),
      ),
  )

  const error = await createApiClient('/api/x')
    .get('/things')
    .catch((e: unknown) => e)

  expect(error).toBeInstanceOf(ApiError)
  expect((error as ApiError).status).toBe(500)
  expect((error as ApiError).body).toBe('System.ArgumentNullException: boom')
})

test('a 401 that is not JSON still calls onUnauthorized', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(new Response('<html>Sign in</html>', { status: 401 })),
  )
  const onUnauthorized = vi.fn()

  const error = await createApiClient('/api/x', { onUnauthorized })
    .get('/things')
    .catch((e: unknown) => e)

  expect(onUnauthorized).toHaveBeenCalledOnce()
  expect((error as ApiError).status).toBe(401)
})

test('passes the credentials option through to fetch', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)

  await createApiClient('/api/x', { credentials: 'include' }).get('/things')

  expect(fetchMock.mock.calls[0][1].credentials).toBe('include')
})

test('401 calls onUnauthorized and still throws ApiError', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(null, { status: 401 })),
  )
  const onUnauthorized = vi.fn()

  const error = await createApiClient('/api/x', { onUnauthorized })
    .get('/things')
    .catch((e: unknown) => e)

  expect(onUnauthorized).toHaveBeenCalledOnce()
  expect(error).toBeInstanceOf(ApiError)
  expect((error as ApiError).status).toBe(401)
})

test('onUnauthorized is not called for other errors or successes', async () => {
  const onUnauthorized = vi.fn()
  const client = createApiClient('/api/x', { onUnauthorized })

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(null, { status: 403 })),
  )
  await client.get('/things').catch(() => undefined)

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
  )
  await client.get('/things')

  expect(onUnauthorized).not.toHaveBeenCalled()
})

test('delete tolerates an empty response body', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  )

  await expect(
    createApiClient('/api/x').delete('/things/1'),
  ).resolves.toBeUndefined()
})
