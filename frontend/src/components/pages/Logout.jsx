import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Button type="primary" danger onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
