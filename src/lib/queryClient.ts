import { QueryClient } from '@tanstack/react-query'
import type { CurrentUser } from '../api/auth'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

// Cache key for "who is signed in": a user, or null when nobody is.
export const currentUserQueryKey = ['auth', 'me'] as const

// Records who is signed in (null for nobody). Anything cached for the previous
// user is dropped first, so one person's data never shows up for the next.
// The sign-in query itself is kept, so the app keeps watching it.
export const setCurrentUser = (
  client: QueryClient,
  user: CurrentUser | null,
) => {
  client.removeQueries({
    predicate: (query) => query.queryKey[0] !== currentUserQueryKey[0],
  })
  client.setQueryData(currentUserQueryKey, user)
}

// Called when the API rejects a request as unauthenticated (for example the
// session expired), so the UI can send the user back to signed-out.
export const expireSession = () => {
  setCurrentUser(queryClient, null)
}
