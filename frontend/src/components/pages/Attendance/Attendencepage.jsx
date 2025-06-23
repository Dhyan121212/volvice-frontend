import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Select, Input, Button, message, Table, Tag } from 'antd';
import './Attendance.css';

const { Option } = Select;

const workTypes = [
  'Work from Office',
  'Work from Home',
  'Client Office',
  'Leave',
  'Manual Check-in'
];

const Attendance = () => {
  const { empId } = useParams();
  const storedEmployee = JSON.parse(localStorage.getItem("employee"));
  const employeeId = empId ? parseInt(empId, 10) : storedEmployee?.empId;
  const employeeName = storedEmployee?.name || localStorage.getItem('empName') || 'Employee';
  const token = localStorage.getItem('token');

  const [workType, setWorkType] = useState(workTypes[0]);
  const [checkInHour, setCheckInHour] = useState('');
  const [checkInMinute, setCheckInMinute] = useState('');
  const [checkInMeridiem, setCheckInMeridiem] = useState('AM');
  const [checkOutHour, setCheckOutHour] = useState('');
  const [checkOutMinute, setCheckOutMinute] = useState('');
  const [checkOutMeridiem, setCheckOutMeridiem] = useState('AM');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [filterType, setFilterType] = useState('All');

  const API_BASE = 'http://localhost:8081/api/attendance';

  useEffect(() => {
    if (!token) {
      message.error('Unauthorized. Please login.');
      return;
    }

    if (!employeeId || isNaN(employeeId)) {
      message.error('Invalid employee ID. Please re-login.');
      return;
    }

    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(API_BASE, {
        params: { employeeId },
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      const fallback = JSON.parse(localStorage.getItem('attendance') || '[]');
      setAttendance(fallback.filter(entry => entry.employeeId === employeeId));
    }
  };

  const handleCheckIn = () => {
    if (!checkInHour || !checkInMinute) {
      message.warning('Please enter Check-In time.');
      return;
    }
    const time = convertTo24HourFormat(checkInHour, checkInMinute, checkInMeridiem);
    setCheckInTime(time);
    setIsCheckedIn(true);
    message.success('Checked In! Please check out when you are done.');
  };

  const handleCheckOut = async () => {
    if (!checkOutHour || !checkOutMinute) {
      message.warning('Please enter Check-Out time.');
      return;
    }

    const checkOutTime = convertTo24HourFormat(checkOutHour, checkOutMinute, checkOutMeridiem);
    const totalHours = calculateTotalHours(checkInTime, checkOutTime);

    const newEntry = {
      employeeId,
      employeeName,
      date: new Date().toISOString().split('T')[0],
      checkInTime,
      checkOutTime,
      workType,
      totalHours
    };

    try {
      await axios.post(API_BASE, newEntry, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Attendance recorded!');
      fetchAttendance();
      resetFields();
    } catch (error) {
      console.error(error);
      message.error('Failed to record attendance.');
    }
  };

  const convertTo24HourFormat = (hour, minute, meridiem) => {
    let h = parseInt(hour, 10);
    if (meridiem === 'PM' && h !== 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const calculateTotalHours = (start, end) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startDate = new Date(0, 0, 0, sh, sm);
    const endDate = new Date(0, 0, 0, eh, em);
    let diff = (endDate - startDate) / 1000 / 60 / 60;
    if (diff < 0) diff += 24;
    return parseFloat(diff.toFixed(2));
  };

  const resetFields = () => {
    setCheckInHour('');
    setCheckInMinute('');
    setCheckInMeridiem('AM');
    setCheckOutHour('');
    setCheckOutMinute('');
    setCheckOutMeridiem('AM');
    setCheckInTime('');
    setIsCheckedIn(false);
    setWorkType(workTypes[0]);
  };

  const filteredAttendance = filterType === 'All'
    ? attendance
    : attendance.filter(entry => entry.workType === filterType);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Check-In',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
    },
    {
      title: 'Check-Out',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
    },
    {
      title: 'Work Type',
      dataIndex: 'workType',
      key: 'workType',
      render: (type) => <Tag color="geekblue">{type}</Tag>,
    },
    {
      title: 'Total Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
    }
  ];

  return (
    <>
      <Card
        title={`Attendance - ${employeeName}`}
        style={{
          maxWidth: 1000,
          margin: '2rem auto',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <Button onClick={() => document.body.classList.toggle('dark-mode')}>Toggle Dark Mode</Button>
        </div>

        <div className="check-section modern-checkin">
          <h3>Check-In</h3>
          <div className="checkin-row">
            <label>Work type:</label>
            <Select value={workType} onChange={setWorkType} style={{ width: 180 }} size="small">
              {workTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>

            <label>Enter Time:</label>
            <Input placeholder="hh" value={checkInHour} onChange={e => setCheckInHour(e.target.value)} style={{ width: 60 }} size="small" />
            <span>:</span>
            <Input placeholder="mm" value={checkInMinute} onChange={e => setCheckInMinute(e.target.value)} style={{ width: 60 }} size="small" />
            <Select value={checkInMeridiem} onChange={setCheckInMeridiem} style={{ width: 70 }} size="small">
              <Option value="AM">AM</Option>
              <Option value="PM">PM</Option>
            </Select>

            <Button type="primary" size="small" onClick={handleCheckIn} className="checkin-btn">Check-In</Button>
          </div>
        </div>

        {isCheckedIn && (
          <div className="check-section modern-checkin">
            <h3>Check-Out</h3>
            <div className="checkin-row">
              <label>Enter Time:</label>
              <Input placeholder="hh" value={checkOutHour} onChange={e => setCheckOutHour(e.target.value)} style={{ width: 60 }} size="small" />
              <span>:</span>
              <Input placeholder="mm" value={checkOutMinute} onChange={e => setCheckOutMinute(e.target.value)} style={{ width: 60 }} size="small" />
              <Select value={checkOutMeridiem} onChange={setCheckOutMeridiem} style={{ width: 70 }} size="small">
                <Option value="AM">AM</Option>
                <Option value="PM">PM</Option>
              </Select>

              <Button type="primary" size="small" onClick={handleCheckOut} className="checkin-btn">Check-Out</Button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <label><strong>Filter by Work Type:</strong></label>
          <Select value={filterType} onChange={setFilterType} style={{ width: 200, marginLeft: 8 }}>
            <Option value="All">All</Option>
            {workTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </div>

        <Table
          style={{ marginTop: '2rem' }}
          columns={columns}
          dataSource={filteredAttendance.map((entry, index) => ({ ...entry, key: index }))}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </Card>
    </>
  );
};

export default Attendance;
