import { create } from 'zustand';

interface Server {
  id: string;
  name: string;
  icon?: string;
  memberCount: number;
}

interface Channel {
  id: string;
  name: string;
  type: string;
  position: number;
}

interface UIState {
  sidebarOpen: boolean;
  selectedServer: Server | null;
  selectedChannel: Channel | null;
  setSidebarOpen: (open: boolean) => void;
  selectServer: (server: Server) => void;
  selectChannel: (channel: Channel) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  selectedServer: null,
  selectedChannel: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  selectServer: (server) => set({ selectedServer: server }),
  selectChannel: (channel) => set({ selectedChannel: channel }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
