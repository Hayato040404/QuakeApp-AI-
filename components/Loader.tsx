import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-75 animate-ping"></div>
        <div className="absolute inset-2 bg-indigo-500 rounded-full opacity-75 animate-ping" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute inset-4 bg-teal-400 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-300 tracking-widest animate-pulse">地震データを取得中...</p>
    </div>
  );
};

export default Loader;