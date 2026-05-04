import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const SERVER_KEYS = {
  all: ['servers'],
  list: () => [...SERVER_KEYS.all, 'list'],
  my: () => [...SERVER_KEYS.all, 'my'],
  detail: (id: string) => [...SERVER_KEYS.all, 'detail', id],
  members: (id: string) => [...SERVER_KEYS.all, 'members', id],
};

export const useServers = () => {
  return useQuery({
    queryKey: SERVER_KEYS.my(),
    queryFn: () => api.get('/servers/me/servers'),
  });
};

export const useServer = (serverId: string) => {
  return useQuery({
    queryKey: SERVER_KEYS.detail(serverId),
    queryFn: () => api.get(`/servers/${serverId}`),
    enabled: !!serverId,
  });
};

export const useCreateServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post('/servers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVER_KEYS.my() });
    },
  });
};

export const useJoinServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serverId: string) =>
      api.post(`/servers/${serverId}/join`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVER_KEYS.my() });
    },
  });
};

export const useServerMembers = (serverId: string) => {
  return useQuery({
    queryKey: SERVER_KEYS.members(serverId),
    queryFn: () => api.get(`/servers/${serverId}/members`),
    enabled: !!serverId,
  });
};
