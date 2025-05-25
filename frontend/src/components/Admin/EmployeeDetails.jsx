import React from 'react';
import { Table, Tag } from 'antd';

const employeeData = [
  {
    id: 'EMP001',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    department: 'Engineering',
    designation: 'Frontend Developer',
    joiningDate: '2021-06-15',
    phone: '+1-555-0101',
    address: '123 Maple Street, New York, NY',
    status: 'Active',
  },
  {
    id: 'EMP002',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    department: 'Engineering',
    designation: 'Backend Developer',
    joiningDate: '2020-03-10',
    phone: '+1-555-0102',
    address: '456 Oak Avenue, Boston, MA',
    status: 'Active',
  },
  {
    id: 'EMP003',
    name: 'Carla Adams',
    email: 'carla.adams@example.com',
    department: 'HR',
    designation: 'HR Manager',
    joiningDate: '2019-09-25',
    phone: '+1-555-0103',
    address: '789 Pine Road, Chicago, IL',
    status: 'On Leave',
  },
  {
    id: 'EMP004',
    name: 'David Lee',
    email: 'david.lee@example.com',
    department: 'Finance',
    designation: 'Accountant',
    joiningDate: '2018-12-01',
    phone: '+1-555-0104',
    address: '321 Birch Lane, San Francisco, CA',
    status: 'Active',
  },
  {
    id: 'EMP005',
    name: 'Eva Green',
    email: 'eva.green@example.com',
    department: 'Marketing',
    designation: 'Content Strategist',
    joiningDate: '2022-01-20',
    phone: '+1-555-0105',
    address: '654 Spruce Blvd, Seattle, WA',
    status: 'Inactive',
  },
  {
    id: 'EMP006',
    name: 'Frank Turner',
    email: 'frank.turner@example.com',
    department: 'IT Support',
    designation: 'Support Engineer',
    joiningDate: '2017-04-18',
    phone: '+1-555-0106',
    address: '910 Walnut St, Austin, TX',
    status: 'Active',
  },
  {
    id: 'EMP007',
    name: 'Grace Chen',
    email: 'grace.chen@example.com',
    department: 'Product',
    designation: 'Product Manager',
    joiningDate: '2021-11-30',
    phone: '+1-555-0107',
    address: '1050 Cedar Ave, Denver, CO',
    status: 'Active',
  },
  {
    id: 'EMP008',
    name: 'Henry Martin',
    email: 'henry.martin@example.com',
    department: 'Legal',
    designation: 'Legal Advisor',
    joiningDate: '2020-07-08',
    phone: '+1-555-0108',
    address: '870 Palm St, Miami, FL',
    status: 'Resigned',
  },
  {
    id: 'EMP009',
    name: 'Isla Davis',
    email: 'isla.davis@example.com',
    department: 'Design',
    designation: 'UI/UX Designer',
    joiningDate: '2022-03-12',
    phone: '+1-555-0109',
    address: '150 Redwood Dr, Portland, OR',
    status: 'Active',
  },
  {
    id: 'EMP010',
    name: 'Jack Wilson',
    email: 'jack.wilson@example.com',
    department: 'Engineering',
    designation: 'DevOps Engineer',
    joiningDate: '2019-01-22',
    phone: '+1-555-0110',
    address: '290 Ash St, Los Angeles, CA',
    status: 'On Leave',
  },
];

const columns = [
  {
    title: 'Employee ID',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: 'Designation',
    dataIndex: 'designation',
    key: 'designation',
  },
  {
    title: 'Joining Date',
    dataIndex: 'joiningDate',
    key: 'joiningDate',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = 'default';
      if (status === 'Active') color = 'green';
      else if (status === 'Inactive') color = 'red';
      else if (status === 'On Leave') color = 'orange';
      else if (status === 'Resigned') color = 'gray';

      return <Tag color={color}>{status}</Tag>;
    },
  },
];

const EmployeeDetails = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employee Details</h1>
      <Table
        dataSource={employeeData}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default EmployeeDetails;
