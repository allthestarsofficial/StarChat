import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useServers } from '@/hooks/useServers';
import { Hash, Settings, Plus } from 'lucide-react';

const ServerBar: React.FC = () => {
  const navigate = useNavigate();
  const { data: serversResponse } = useServers();
  const servers = serversResponse?.data?.data || [];

  return (
    <div className="flex flex-col items-center gap-2 bg-slate-950 px-3 py-4 w-20 border-r border-slate-800">
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 cursor-pointer hover:rounded-lg transition-all"
      >
        <span className="text-white font-bold text-xl">⭐</span>
      </div>

      <div className="w-full h-px bg-slate-800" />

      {/* Servers */}
      <div className="flex flex-col gap-2 flex-1">
        {servers.map((server: any) => (
          <button
            key={server.id}
            onClick={() => navigate(`/servers/${server.id}`)}
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 hover:bg-slate-700 transition hover:rounded-2xl group"
            title={server.name}
          >
            {server.icon ? (
              <img
                src={server.icon}
                alt={server.name}
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <span className="text-sm font-bold">{server.name[0]}</span>
            )}
          </button>
        ))}
      </div>

      <button className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 hover:bg-green-500 transition text-green-500 hover:text-white">
        <Plus size={20} />
      </button>
    </div>
  );
};

export default ServerBar;
