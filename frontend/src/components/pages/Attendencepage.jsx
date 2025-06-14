import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Select, Input, Button, message } from 'antd';

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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      message.error('Unable to fetch attendance data from server.');

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
          console.log("Token being sent:", token);
      await axios.post(API_BASE, newEntry, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      message.success('Attendance recorded!');
      fetchAttendance();
      resetFields();
    } catch (error) {
      console.error(error);
      message.error('Failed to record attendance. Please try again.');
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

  const fillCurrentCheckInTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    setCheckInHour(String(hours).padStart(2, '0'));
    setCheckInMinute(String(minutes).padStart(2, '0'));
    setCheckInMeridiem(meridiem);
  };

  const filteredAttendance = filterType === 'All'
    ? attendance
    : attendance.filter(entry => entry.workType === filterType);

  return (
    <Card
      title={`Attendance - ${employeeName}`}
      style={{
        maxWidth: 1000,
        margin: '2rem auto',
        padding: '2rem',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '1rem'
      }}
    >
      {/* Check-In UI */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: 12 }}>Check-In</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: 'bold' }}>Work type:</label>
            <Select value={workType} onChange={setWorkType} style={{ width: 180 }}>
              {workTypes.map((type) => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>

            <label style={{ fontWeight: 'bold' }}>Enter Time:</label>
            <Input type="number" placeholder="hh" value={checkInHour} onChange={e => setCheckInHour(e.target.value)} style={{ width: 60 }} />
            <span>:</span>
            <Input type="number" placeholder="mm" value={checkInMinute} onChange={e => setCheckInMinute(e.target.value)} style={{ width: 60 }} />
            <Select value={checkInMeridiem} onChange={setCheckInMeridiem} style={{ width: 80 }}>
              <Option value="AM">AM</Option>
              <Option value="PM">PM</Option>
            </Select>

            <Button onClick={fillCurrentCheckInTime}>Now</Button>
            <Button type="primary" onClick={handleCheckIn}>Check-In</Button>
          </div>
        </div>

        {/* Check-Out UI */}
        {isCheckedIn && (
          <div>
            <h3 style={{ marginBottom: 12 }}>Check-Out</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ fontWeight: 'bold' }}>Enter Time:</label>
              <Input type="number" placeholder="hh" value={checkOutHour} onChange={e => setCheckOutHour(e.target.value)} style={{ width: 60 }} />
              <span>:</span>
              <Input type="number" placeholder="mm" value={checkOutMinute} onChange={e => setCheckOutMinute(e.target.value)} style={{ width: 60 }} />
              <Select value={checkOutMeridiem} onChange={setCheckOutMeridiem} style={{ width: 80 }}>
                <Option value="AM">AM</Option>
                <Option value="PM">PM</Option>
              </Select>

              <Button type="primary" onClick={handleCheckOut}>Check-Out</Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Display */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontWeight: 'bold' }}>Filter by Work Type:</label>
        <Select value={filterType} onChange={setFilterType} style={{ width: 200 }}>
          <Option value="All">All</Option>
          {workTypes.map(type => (
            <Option key={type} value={type}>{type}</Option>
          ))}
        </Select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}
      >
        {filteredAttendance.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>
            No attendance records for selected work type.
          </div>
        ) : (
          filteredAttendance.map(entry => (
            <div
              key={entry.id || entry.key}
              style={{
                background: '#f9f9f9',
                borderRadius: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '1rem',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <h4 style={{ marginBottom: 8 }}>{entry.date}</h4>
              <p><strong>Check-In:</strong> {entry.checkInTime}</p>
              <p><strong>Check-Out:</strong> {entry.checkOutTime}</p>
              <p><strong>Work Type:</strong> {entry.workType}</p>
              <p><strong>Total Hours:</strong> {entry.totalHours}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default Attendance;
