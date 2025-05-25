import { Home, Calendar, User, Users, Settings, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex flex-col items-center gap-2 px-4 py-6
        rounded-md cursor-pointer
        transition-all duration-500
        ${isActive ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-cyan-400 hover:text-white'}
      `}
    >
      <Icon
        className={`
          w-8 h-8 transform
          transition-transform duration-500
          ${isActive ? 'scale-125' : 'group-hover:scale-125'}
        `}
      />
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export default function AdminSidebar() {
  return (
    <div className="w-40 h-screen bg-cyan-700 text-white flex flex-col">
      <div className="flex-grow" />

      <div className="flex flex-col items-center space-y-4 mb-10">
        <SidebarItem icon={Home} label="Dashboard" to="/admin" />
        <SidebarItem icon={User} label="Leaves" to="/admin/leaves" />
        <SidebarItem icon={Calendar} label="Timesheet" to="/admin/timesheet" />
        <SidebarItem icon={ClipboardList} label="Holidays" to="/admin/holidays" />
        <SidebarItem icon={Users} label="Users" to="/admin/users" />
        <SidebarItem icon={Settings} label="Settings" to="/admin/settings" />
      </div>
    </div>
  );
}
