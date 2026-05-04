import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import ServerBar from '@/components/layout/ServerBar';
import { useUIStore } from '@/stores/ui.store';
import { initializeSocket } from '@/lib/socket';

const MainLayout: React.FC = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  useEffect(() => {
    initializeSocket();
  }, []);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      <ServerBar />
      {sidebarOpen && <Sidebar />}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
