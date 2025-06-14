import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import axios from 'axios';

const columns = [
  {
    title: 'Employee ID',
    dataIndex: 'employeeId',
    key: 'employeeId',
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
      const colorMap = {
        Active: 'green',
        Inactive: 'red',
        'On Leave': 'orange',
        Resigned: 'gray',
      };
      return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
    },
  },
];

const EmployeeDetails = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/employees')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch employee data:', err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employee Details</h1>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="employeeId"
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default EmployeeDetails;
