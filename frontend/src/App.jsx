import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Signin from './components/signIns/Signin';
import AdminRoutes from './components/Admin/AdminRoutes';
import EmployeeRoutes from './components/Employee/EmployeeRoutes';

import { loginSuccess, logout } from './Redux/Slices/AuthSlice';

const App = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, token, employee } = useSelector(state => state.auth);
  const role = employee?.role?.toLowerCase();
  const empId = employee?.empId || employee?.id; // use whatever you're storing

  // Auto login if token/employee exists in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmployee = JSON.parse(localStorage.getItem('employee'));

    if (storedToken && storedEmployee) {
      dispatch(loginSuccess({ token: storedToken, employee: storedEmployee }));
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
  };

  return (
    <Routes>
      <Route path="/login" element={<Signin />} />

      {isAuthenticated ? (
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
