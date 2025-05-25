import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminSidebar from '../Layouts/AdminSidebar';
import AdminTopBar from './AdminTopbar';

import Dashboard from '../pages/Dashboard';
import Leaves from '../pages/Leaves';
import Holidays from '../pages/Holidays';
import TimeSheet from '../pages/TimeSheet';
import AttendanceTab from '../pages/AttendenceTab';
import Attendancepage from '../pages/Attendencepage';

 import EmployeeDetails from './EmployeeDetails';
import TeamAttendance from './TeamAttendence';

const AdminRoutes = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-screen bg-white">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <AdminSidebar onLogout={onLogout} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow bg-gray-100">
        {/* Top Bar */}
        <AdminTopBar />

        {/* Main Page Content with Routes */}
        <div className="p-6 overflow-auto flex-grow">
          <Routes>
            {/* index route matches '/admin' */}
            <Route index element={<Dashboard />} />

            {/* exact admin paths */}
            <Route path="home" element={<Dashboard />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="holidays" element={<Holidays />} />
            <Route path="timesheet" element={<TimeSheet />} />
            <Route path="attendance" element={<Attendancepage />} />
            <Route path="attendance-tab" element={<AttendanceTab />} />
           


            <Route path="employee-details" element={<EmployeeDetails />} />
            <Route path="team-attendence" element={<TeamAttendance />} />


            {/* catch-all redirect */}
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;
