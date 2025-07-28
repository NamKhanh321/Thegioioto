import React from 'react';

const Loading = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Trang quản lý tài khoản</h1>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    </div>
    </div>
  );
};

export default Loading;
