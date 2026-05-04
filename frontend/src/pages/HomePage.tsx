import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">Welcome to StarChat</h1>
      <p className="text-slate-400">Select a server or channel to get started</p>
    </div>
  );
};

export default HomePage;
