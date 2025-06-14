import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async ({ empId, password }) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: empId, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token || !data.username) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and username
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);

      message.success('Login successful!');
      navigate(`/user/${data.username}/home`);
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card title="User Login" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="empId"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signin;
