import React from 'react';
import { Home, AppWindow, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token or any session-related data (optional)
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-slate-800 text-white p-6 flex items-center shadow-md relative h-20">
      {/* Logo/Brand */}
      <h1 className="text-2xl font-bold px-9">VOLVICE</h1>

      {/* Centered navigation links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-12 items-center">
        <a href="#" className="hover:text-gray-300 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Home
        </a>
        <a href="#" className="hover:text-gray-300 flex items-center gap-2">
          <AppWindow className="w-5 h-5" />
          Apps
        </a>
        <a href="#" className="hover:text-gray-300 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Help
        </a>
      </div>

      {/* Logout Button - aligned right */}
      <div className="ml-auto pr-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
