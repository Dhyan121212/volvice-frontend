import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';

import Dashboard from '../pages/Dashboard';
import Leaves from '../pages/Leaves';
import Holidays from '../pages/Holidays';
import TimeSheet from '../pages/TimeSheet';
import AttendanceTab from '../pages/AttendenceTab';
import Attendancepage from '../pages/Attendencepage';

const EmployeeRoutes = ({ onLogout }) => {
  return (
    <Layout onLogout={onLogout}>
      <Routes>
        {/* index route matches '/' */}
        <Route index element={<Dashboard />} />

        {/* relative paths, no leading slash */}
        <Route path="home" element={<Dashboard />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="holidays" element={<Holidays />} />
        <Route path="timesheet" element={<TimeSheet />} />
        <Route path="attendence" element={<Attendancepage />} />
        <Route path="attendence-tab" element={<AttendanceTab />} />

        {/* catch-all redirects to home */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </Layout>
  );
};

export default EmployeeRoutes;
