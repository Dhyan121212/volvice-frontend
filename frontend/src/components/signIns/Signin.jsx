import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message, Card } from 'antd';
import './Signin.css';

const Signin = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);

    if (username === 'admin' && password === 'admin123') {
      message.success('Pranaam Maalik!');
      onLogin('admin');
      navigate('/');
    } else if ((username === 'dheeraj' && password === '123') || (username === 'shaz' && password === '143')) {
      message.success('KAAM KAR BADWE!!');
      onLogin('employee');
      navigate('/');
    } else {
      message.error('Invalid credentials');
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Sign In" style={{ width: 300 }}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: 16 }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" block onClick={handleLogin} loading={loading}>
          Sign In
        </Button>
      </Card>
    </div>
  );
};

export default Signin;
