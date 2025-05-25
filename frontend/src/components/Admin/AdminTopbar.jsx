import React, { useState, useRef, useEffect } from 'react';
import { Home, AppWindow, HelpCircle, LogOut, CheckCircle, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminTopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-cyan-400 text-white p-6 flex items-center shadow-md relative h-20 z-50">
      <h1 className="text-2xl font-bold px-9">VOLVICE</h1>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-12 items-center">
        <a href="#" className="hover:text-gray-300 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Home
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="hover:text-gray-300 flex items-center gap-2 focus:outline-none"
          >
            <AppWindow className="w-5 h-5" />
            Apps
          </button>

          <div
            className={`absolute left-1/2 transform -translate-x-1/2 mt-2 bg-blue-100 text-gray-800 rounded-md p-4 border border-blue-400 w-60 shadow-xl transition-all duration-300 ease-in-out origin-top ${
              showDropdown ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
            }`}
            style={{ transformOrigin: 'top' }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 hover:text-cyan-700 cursor-pointer">
                <CheckCircle className="w-4 h-4" />
                Approvals
              </div>
              

               <div
                className="flex items-center gap-2 hover:text-cyan-700 cursor-pointer"
                onClick={() => {
                  navigate('/admin/team-attendence');
                  setShowDropdown(false);
                }}
              >
                <Users className="w-4 h-4" />
                 Team Attendance
              </div> 
               
              <div
                className="flex items-center gap-2 hover:text-cyan-700 cursor-pointer"
                onClick={() => {
                  navigate('/admin/employee-details');
                  setShowDropdown(false);
                }}
              >
                <Users className="w-4 h-4" />
                Employee Details
              </div>
            </div>
          </div>
        </div>

        <a href="#" className="hover:text-gray-300 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Help
        </a>
      </div>

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

export default AdminTopBar;
