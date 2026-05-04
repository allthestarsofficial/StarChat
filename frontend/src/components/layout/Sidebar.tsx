import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServer } from '@/hooks/useServers';
import { Hash, MoreVertical, Search, Bell } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { serverId } = useParams();
  const { data: serverResponse } = useServer(serverId || '');
  const server = serverResponse?.data?.data;
  const [searchQuery, setSearchQuery] = useState('');

  if (!server) {
    return (
      <div className="w-64 bg-slate-950 border-r border-slate-800 p-4">
        <p className="text-slate-400 text-sm">Select a server</p>
      </div>
    );
  }

  const channels = server.channels || [];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <h2 className="font-bold text-lg truncate">{server.name}</h2>
        <p className="text-xs text-slate-400">{server.memberCount} members</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-slate-700"
          />
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Channels</h3>
        <div className="space-y-1">
          {channels.map((channel: any) => (
            <button
              key={channel.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-900 transition text-slate-300 hover:text-white"
            >
              <Hash size={16} />
              <span className="text-sm truncate">{channel.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 flex gap-2">
        <button className="flex-1 px-3 py-2 bg-slate-900 rounded-lg text-slate-300 hover:text-white text-sm transition hover:bg-slate-800">
          Settings
        </button>
        <button className="px-3 py-2 bg-slate-900 rounded-lg text-slate-300 hover:text-white transition hover:bg-slate-800">
          <Bell size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
