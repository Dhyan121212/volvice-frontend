import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from '../Admin/AdminTopbar';

const AdminLayout = ({ children, onLogout }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 bg-gray-100">
        <AdminTopBar onLogout={onLogout} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
