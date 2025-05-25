import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Signin from './components/signIns/Signin';
import AdminRoutes from './components/Admin/AdminRoutes';
import EmployeeRoutes from './components/Employee/EmployeeRoutes';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  const handleLogin = (userRole) => {
    setLoggedIn(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole('');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Signin onLogin={handleLogin} />} />

        {loggedIn ? (
          <>
            <Route
              path="/"
              element={
                role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />
            {role === 'admin' ? (
              <Route path="/admin/*" element={<AdminRoutes onLogout={handleLogout} />} />
            ) : (
              <Route path="/*" element={<EmployeeRoutes onLogout={handleLogout} />} />
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;

