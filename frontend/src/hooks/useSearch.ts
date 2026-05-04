import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const SEARCH_KEYS = {
  users: (q: string) => ['search', 'users', q],
  servers: (q: string) => ['search', 'servers', q],
  global: (q: string) => ['search', 'global', q],
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: SEARCH_KEYS.users(query),
    queryFn: () => api.get('/search/users', { params: { q: query } }),
    enabled: query.length > 0,
  });
};

export const useSearchServers = (query: string) => {
  return useQuery({
    queryKey: SEARCH_KEYS.servers(query),
    queryFn: () => api.get('/search/servers', { params: { q: query } }),
    enabled: query.length > 0,
  });
};

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: SEARCH_KEYS.global(query),
    queryFn: () => api.get('/search/global', { params: { q: query } }),
    enabled: query.length > 0,
  });
};
