import React from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';

import AdminSidebar from '../Layouts/AdminSidebar';
import AdminTopBar from './AdminTopbar';

import Dashboard from '../pages/Dashboard';
import Leaves from '../pages/Leaves/Leaves';
import Holidays from '../pages/Holidays/Holidays';
import TimeSheet from '../pages/TimeSheet/TimeSheet';
import AttendanceTab from '../pages/Attendance/AttendenceTab';
import Attendancepage from '../pages/Attendance/Attendencepage';

import EmployeeDetails from './EmployeeDetails';
import TeamAttendance from './TeamAttendence';

import LeaveApprovals from './LeaveApproval';  // Leave approvals page

const AdminRoutes = ({ onLogout }) => {
  const navigate = useNavigate();
  const { adminId } = useParams(); // optional if you want admin id param

  // Example handlers to navigate to routes
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <AdminSidebar onLogout={onLogout} adminId={adminId} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow bg-gray-100">
        {/* Top Bar */}
        <AdminTopBar adminId={adminId} />

        {/* Main Page Content with Routes */}
        <div className="p-6 overflow-auto flex-grow">
          <Routes>
            {/* if using adminId param in route path, these will be relative */}
            <Route index element={<Dashboard adminId={adminId} />} />
            <Route path="home" element={<Dashboard adminId={adminId} />} />
            <Route path="leaves" element={<Leaves adminId={adminId} />} />
            <Route path="holidays" element={<Holidays adminId={adminId} />} />
            <Route path="timesheet" element={<TimeSheet adminId={adminId} />} />
            <Route path="attendance" element={<Attendancepage adminId={adminId} />} />
            <Route path="attendance-tab" element={<AttendanceTab adminId={adminId} />} />
            <Route path="employee-details" element={<EmployeeDetails adminId={adminId} />} />
            <Route path="team-attendence" element={<TeamAttendance adminId={adminId} />} />
            <Route path="approvals" element={<LeaveApprovals adminId={adminId} />} />
            {/* catch-all redirect */}
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;
