import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../api/auth'
import { setCurrentUser } from '../lib/queryClient'

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => setCurrentUser(queryClient, user),
  })
}
