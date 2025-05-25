import { Home, Calendar, User, LogIn, HelpCircle, Apple } from 'lucide-react';
import { Link } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to }) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-2 px-4 py-6 text-gray-300 hover:bg-cyan-400 hover:text-white transition-all duration-500 cursor-pointer group rounded-md"
  >
    <Icon className="w-8 h-8 transform group-hover:scale-125 transition-transform duration-500" />
    <span className="text-xs">{label}</span>
  </Link>
);

export default function Sidebar() {
  return (
    <div className="w-40 h-screen bg-cyan-700 text-white flex flex-col">
      {/* This pushes items to bottom */}
      <div className="flex-grow" />

      {/* Sidebar items positioned toward the bottom */}
      <div className="flex flex-col items-center space-y-4 mb-10">
        <SidebarItem icon={Home} label="Home" to="/Home" />
        <SidebarItem icon={Calendar} label="Time Sheet" to="/Timesheet" />
        <SidebarItem icon={User} label="Leaves" to="/leaves" />
        <SidebarItem icon={Apple} label="Holidays" to="/holidays" />
        <SidebarItem icon={LogIn} label="Attendance" to="/Attendence" />
        <SidebarItem icon={HelpCircle} label="Payroll" disabled />
      </div>
    </div>
  );
}
