import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import EmployeeRoutes from './EmployeeRoutes';

const EmployeeRouteWrapper = ({ onLogout }) => {
  const { employeeId } = useParams();

  if (!employeeId) {
    return <Navigate to="/" replace />;
  }

  return <EmployeeRoutes employeeId={employeeId} onLogout={onLogout} />;
};

export default EmployeeRouteWrapper;
