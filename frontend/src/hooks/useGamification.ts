import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const GAMIFICATION_KEYS = {
  stats: ['gamification', 'stats'],
  leaderboard: (serverId: string) => ['gamification', 'leaderboard', serverId],
  globalLeaderboard: () => ['gamification', 'global-leaderboard'],
};

export const useUserStats = () => {
  return useQuery({
    queryKey: GAMIFICATION_KEYS.stats,
    queryFn: () => api.get('/gamification/me/stats'),
  });
};

export const useServerLeaderboard = (serverId: string) => {
  return useQuery({
    queryKey: GAMIFICATION_KEYS.leaderboard(serverId),
    queryFn: () => api.get(`/gamification/servers/${serverId}/leaderboard`),
    enabled: !!serverId,
  });
};

export const useGlobalLeaderboard = () => {
  return useQuery({
    queryKey: GAMIFICATION_KEYS.globalLeaderboard(),
    queryFn: () => api.get('/gamification/global/leaderboard'),
  });
};
