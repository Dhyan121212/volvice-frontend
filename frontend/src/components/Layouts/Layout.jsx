// Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './Topbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <TopBar onLogout={onLogout} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
