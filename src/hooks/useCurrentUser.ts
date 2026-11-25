import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/auth'
import { currentUserQueryKey } from '../lib/queryClient'

// data is undefined while loading, null when nobody is signed in, otherwise the user.
export const useCurrentUser = () =>
  useQuery({
    queryKey: currentUserQueryKey,
    queryFn: ({ signal }) => getCurrentUser(signal),
    retry: false,
  })
