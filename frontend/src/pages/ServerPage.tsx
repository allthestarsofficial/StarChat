import React from 'react';
import { useParams } from 'react-router-dom';
import { useServer } from '@/hooks/useServers';

const ServerPage: React.FC = () => {
  const { serverId } = useParams();
  const { data: serverResponse } = useServer(serverId || '');
  const server = serverResponse?.data?.data;

  if (!server) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-3xl font-bold">{server.name}</h1>
        {server.description && <p className="text-slate-400 mt-2">{server.description}</p>}
      </div>
      <div className="flex-1 p-8">Server content here</div>
    </div>
  );
};

export default ServerPage;
