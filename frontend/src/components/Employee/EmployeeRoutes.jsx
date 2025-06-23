// EmployeeRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layouts/Layout';

import Dashboard from '../pages/Dashboard';
import Leaves from '../pages/Leaves/Leaves';
import Holidays from '../pages/Holidays/Holidays';
import TimeSheet from '../pages/TimeSheet/TimeSheet';
import AttendanceTab from '../pages/Attendance/AttendenceTab';
import Attendancepage from '../pages/Attendance/Attendencepage';

const EmployeeRoutes = ({ onLogout, empId }) => {
  if (!empId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout onLogout={onLogout} />}>
        <Route index element={<Dashboard employeeId={empId} />} />
        <Route path="home" element={<Dashboard employeeId={empId} />} />
        <Route path="leaves" element={<Leaves employeeId={empId} />} />
        <Route path="holidays" element={<Holidays employeeId={empId} />} />
        <Route path="timesheet" element={<TimeSheet employeeId={empId} />} />
        <Route path="attendence" element={<Attendancepage employeeId={empId} />} />
        <Route path="attendence-tab" element={<AttendanceTab employeeId={empId} />} />
        <Route path="*" element={<Navigate to={`/employee/${empId}/home`} replace />} />
      </Route>
    </Routes>
  );
};

export default EmployeeRoutes;
