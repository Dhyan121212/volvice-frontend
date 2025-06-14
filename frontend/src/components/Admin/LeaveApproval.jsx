import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Space } from 'antd';
import dayjs from 'dayjs';

const LeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);

  // Fetch leave requests
  const fetchLeaves = () => {
    fetch('http://localhost:8081/api/v1/leave')
      .then(res => res.json())
      .then(setLeaves)
      .catch(() => message.error('Failed to load leave requests'));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Approve/Reject logic
  const updateStatus = (id, status) => {
    const endpoint = status === 'Approved' ? 'approve' : 'reject';

    fetch(`http://localhost:8081/api/v1/leave/${id}/${endpoint}`, {
      method: 'PUT',
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        message.success(`Leave ${status}`);
        fetchLeaves(); // Refresh data
      })
      .catch(() => message.error('Action failed'));
  };

  // Table columns
  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: id => id || 'N/A',
    },
    { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: date => dayjs(date).format('DD-MM-YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: date => dayjs(date).format('DD-MM-YYYY'),
    },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: status => {
        let color = 'blue';
        if (status === 'Approved') color = 'green';
        else if (status === 'Rejected') color = 'red';
        return <Tag color={color}>{status || 'Pending'}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => updateStatus(record.id, 'Approved')}
            disabled={record.approvalStatus === 'Approved'}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => updateStatus(record.id, 'Rejected')}
            disabled={record.approvalStatus === 'Rejected'}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Leave Approvals</h2>
      <Table dataSource={leaves} columns={columns} rowKey="id" />
    </div>
  );
};

export default LeaveApprovals;
