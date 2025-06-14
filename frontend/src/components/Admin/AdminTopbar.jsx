import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { AppstoreOutlined, UsergroupAddOutlined } from '@ant-design/icons';

const AdminTopBar = () => {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    navigate(e.key); // key holds the route
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="/admin/approvals" icon={<UsergroupAddOutlined />}>
        Leave Approvals
      </Menu.Item>
      <Menu.Item key="/admin/team-attendence" icon={<UsergroupAddOutlined />}>
        Team Attendance
      </Menu.Item>
      <Menu.Item key="/admin/employee-details" icon={<UsergroupAddOutlined />}>
        Employee Details
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="w-full flex justify-end items-center px-6 py-3 bg-cyan-400 text-white shadow-md">
      <div className="flex gap-6 items-center">
        <Button type="link" onClick={() => navigate('/admin/home')} style={{ color: 'white' }}>
          Home
        </Button>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Button type="link" icon={<AppstoreOutlined />} style={{ color: 'white' }}>
            Apps
          </Button>
        </Dropdown>
        <Button type="link" style={{ color: 'white' }}>
          Help
        </Button>
      </div>
    </div>
  );
};

export default AdminTopBar;
