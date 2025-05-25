import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token'));
};

const PrivateRouterr = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRouterr;



