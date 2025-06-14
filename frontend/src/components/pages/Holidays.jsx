import React, { useEffect, useState, useContext } from 'react';
import { message, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { AuthContext } from '../signIns/AuthContext'; // adjust path as needed

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const { token } = useContext(AuthContext); // Use token from context

  useEffect(() => {
  console.log('Token being used:', token); // Debug token

  if (!token || token === 'undefined') {
    message.error('You are not logged in. Please login.');
    return;
  }
    fetch('http://localhost:8081/api/v1/holiday', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(setHolidays)
      .catch((err) => {
        console.error('Fetch error:', err);
        message.error('Failed to fetch holidays. Please check your login.');
      });
  }, [token]);

  const columns = [
    {
      title: 'Holiday Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Holiday List</h2>
      <Table
        dataSource={holidays}
        columns={columns}
        rowKey={(record) => record.id}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Holidays;
