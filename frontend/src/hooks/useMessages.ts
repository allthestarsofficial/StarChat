import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

const MESSAGE_KEYS = {
  all: ['messages'],
  list: (channelId: string) => [...MESSAGE_KEYS.all, 'list', channelId],
  detail: (id: string) => [...MESSAGE_KEYS.all, 'detail', id],
};

export const useMessages = (channelId: string | null) => {
  return useQuery({
    queryKey: MESSAGE_KEYS.list(channelId || ''),
    queryFn: () => api.get(`/channels/${channelId}/messages`),
    enabled: !!channelId,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post(`/messages/channels/${data.channelId}/messages`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.list(variables.channelId),
      });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.patch(`/messages/${data.messageId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.detail(variables.messageId),
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) =>
      api.delete(`/messages/${messageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
    },
  });
};

export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      api.post(`/messages/${data.messageId}/reactions`, { emoji: data.emoji }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.detail(variables.messageId),
      });
    },
  });
};
