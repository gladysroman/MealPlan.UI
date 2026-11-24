import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../api/auth'
import { setCurrentUser } from '../lib/queryClient'

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => setCurrentUser(queryClient, null),
  })
}
