import { Home, Calendar, User, LogIn, HelpCircle, Apple } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

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
  const { employeeId } = useParams(); // Grab employeeId from URL

  return (
    <div className="w-40 h-screen bg-cyan-700 text-white flex flex-col">
      <div className="flex-grow" />
      <div className="flex flex-col items-center space-y-4 mb-10">
        <SidebarItem icon={Home} label="Home" to={`/employee/${employeeId}/home`} />
        <SidebarItem icon={Calendar} label="Time Sheet" to={`/employee/${employeeId}/timesheet`} />
        <SidebarItem icon={User} label="Leaves" to={`/employee/${employeeId}/leaves`} />
        <SidebarItem icon={Apple} label="Holidays" to={`/employee/${employeeId}/holidays`} />
        <SidebarItem icon={LogIn} label="Attendance" to={`/employee/${employeeId}/attendence`} />
        <SidebarItem icon={HelpCircle} label="Payroll" to="#" />
      </div>
    </div>
  );
}
