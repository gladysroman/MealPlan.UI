import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../api/users'

export const useUserProfile = (userId: string | undefined) =>
  useQuery({
    queryKey: ['users', userId, 'profile'],
    queryFn: ({ signal }) => getUserProfile(userId!, signal),
    enabled: userId !== undefined,
  })
