import React from 'react';

const ChannelPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">Channel</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">{/* Messages here */}</div>
      <div className="p-4 border-t border-slate-800">{/* Message input here */}</div>
    </div>
  );
};

export default ChannelPage;
