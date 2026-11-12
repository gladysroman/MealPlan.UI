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

test('delete tolerates an empty response body', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  )

  await expect(
    createApiClient('/api/x').delete('/things/1'),
  ).resolves.toBeUndefined()
})
