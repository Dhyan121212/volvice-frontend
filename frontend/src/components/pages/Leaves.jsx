import React, { useEffect, useState } from 'react';
import { Card, Form, Select, Input, Button, message, Table, Tag } from 'antd';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import LeaveDateSection from './LeaveDateSection';
import 'react-calendar/dist/Calendar.css';

const { Option } = Select;

const isDateBetween = (date, start, end) => {
  const d = dayjs(date);
  const s = dayjs(start);
  const e = dayjs(end);
  return (d.isSame(s) || d.isAfter(s)) && (d.isSame(e) || d.isBefore(e));
};

const LeaveRequest = () => {
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [form] = Form.useForm();

  // ✅ Safely parse token and employee from localStorage
  const token = localStorage.getItem('token');
  let employee;
  try {
    const empRaw = localStorage.getItem('employee');
    employee = empRaw && empRaw !== 'undefined' ? JSON.parse(empRaw) : null;
  } catch (e) {
    employee = null;
  }

  const employeeId = employee?.id;

  useEffect(() => {


    console.log('Token:', token);
console.log('Employee:', employee);
console.log('Employee ID:', employeeId);
    if (!token || !employeeId) {
      message.error('Please login first');
      return;
    }

    fetch('http://localhost:8081/api/v1/holiday', {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch holidays');
        return res.json();
      })
      .then(setHolidays)
      .catch(() => message.error('Failed to fetch holidays'));

    fetch(`http://localhost:8081/api/v1/leave/employee/${employeeId}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch leaves');
        return res.json();
      })
      .then(setLeaves)
      .catch(() => message.error('Failed to fetch leaves'));
  }, [employeeId]);

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    for (const holiday of holidays) {
      if (dayjs(date).isSame(dayjs(holiday.date), 'day')) return 'holiday-highlight';
    }
    for (const leave of leaves) {
      if (isDateBetween(date, leave.startDate, leave.endDate)) return 'leave-highlight';
    }
    return '';
  };

  const onFinish = (values) => {
    const { leaveType, startDate, endDate, reason } = values;

    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      return message.error('End date must be after or equal to start date');
    }

    const duration = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    if (duration > 10) {
      return message.error('Leave duration cannot exceed 10 days');
    }

    const payload = {
      employeeId,
      employeeName: employee?.name || '',
      leaveType,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      reason,
      numberOfDays: duration,
      halfDay: false,
      status: 'PENDING',
    };

    fetch('http://localhost:8081/api/v1/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        message.success('Leave request submitted!');
        form.resetFields();
        return fetch(`http://localhost:8081/api/v1/leave/employee/${employeeId}`, {
          headers: { Authorization: 'Bearer ' + token },
        });
      })
      .then((res) => res.json())
      .then(setLeaves)
      .catch(() => message.error('Failed to submit leave'));
  };

  const columns = [
    { title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId' },
    { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'APPROVED' ? 'green' : status === 'REJECTED' ? 'red' : 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <Card bordered style={{ borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Leave Request</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <Calendar tileClassName={tileClassName} />
          </div>
          <div style={{ flex: 1, minWidth: 320 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ leaveType: 'Paid Leave' }}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Form.Item name="leaveType" label="Leave Type" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Select>
                    <Option value="Paid Leave">Paid Leave</Option>
                    <Option value="Leave Without Pay">Leave Without Pay</Option>
                    <Option value="Work From Home">Work From Home</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="reason" label="Reason" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input />
                </Form.Item>
              </div>
              <LeaveDateSection form={form} />
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Apply Leave
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          <h3>Your Leave History</h3>
          <Table
            dataSource={leaves}
            columns={columns}
            rowKey={(record) => `${record.id}`}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </div>
      </Card>
      <style>{`
        .holiday-highlight {
          background-color: #ff4d4f !important;
          border-radius: 50% !important;
          color: white !important;
        }
        .leave-highlight {
          background-color: #1890ff !important;
          border-radius: 50% !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default LeaveRequest;
