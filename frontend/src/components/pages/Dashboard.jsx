// src/components/pages/Dashboard.jsx
import React from 'react';
import AttendanceTab from './AttendenceTab'; // Adjust the path if needed

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-6">Welcome to the Dashboard</h1>
      <AttendanceTab />
    </div>
  );
};

export default Dashboard;
