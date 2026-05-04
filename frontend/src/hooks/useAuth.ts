import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const AUTH_KEY = ['auth'];

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: any) => api.post('/auth/register', data),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: any) => api.post('/auth/login', data),
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) =>
      api.post('/auth/refresh', { refreshToken }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: () => api.get('/auth/me'),
    enabled: !!localStorage.getItem('auth-store'),
  });
};
