import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/signIns/Signin';
import AdminRoutes from './components/Admin/AdminRoutes';
import EmployeeRoutes from './components/Employee/EmployeeRoutes';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [empId, setEmpId] = useState('');

  useEffect(() => {
    // Load login state from localStorage
    const storedToken = localStorage.getItem('token');
    const storedEmployee = JSON.parse(localStorage.getItem('employee'));

    if (storedToken && storedEmployee) {
      setLoggedIn(true);
      setRole(storedEmployee.role?.toLowerCase());
      setEmpId(storedEmployee.id);
    }
  }, []);

  const handleLogin = (userRole, employeeId) => {
    setLoggedIn(true);
    setRole(userRole);
    setEmpId(employeeId);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole('');
    setEmpId('');
    localStorage.removeItem('token');
    localStorage.removeItem('employee');
  };

  return (
    <Routes>
      <Route path="/login" element={<Signin onLogin={handleLogin} />} />

      {loggedIn ? (
        <>
          <Route
            path="/"
            element={
              role === 'admin'
                ? <Navigate to="/admin" replace />
                : <Navigate to={`/employee/${empId}/home`} replace />
            }
          />

          {role === 'admin' && (
            <Route path="/admin/*" element={<AdminRoutes onLogout={handleLogout} />} />
          )}

          {role === 'employee' && (
            <Route path="/employee/:employeeId/*" element={<EmployeeRoutes onLogout={handleLogout} empId={empId} />} />
          )}

          <Route path="*" element={<Navigate to={role === 'admin' ? '/admin' : `/employee/${empId}/home`} replace />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default App;
