import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Button, Table, message, Tabs } from 'antd';

const { Option } = Select;
const { TabPane } = Tabs;

const workTypes = [
  'Work from Office',
  'Work from Home',
  'Client Office',
  'Leave',
  'Manual Check-in'
];

const Attendance = () => {
  const [workType, setWorkType] = useState(workTypes[0]);

  // Check-in states
  const [checkInHour, setCheckInHour] = useState('');
  const [checkInMinute, setCheckInMinute] = useState('');
  const [checkInMeridiem, setCheckInMeridiem] = useState('AM');

  // Check-out states
  const [checkOutHour, setCheckOutHour] = useState('');
  const [checkOutMinute, setCheckOutMinute] = useState('');
  const [checkOutMeridiem, setCheckOutMeridiem] = useState('AM');

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('');
  const [attendance, setAttendance] = useState([]);

  // Load previous attendance from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('attendance') || '[]');
    setAttendance(stored);
  }, []);

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

  const handleCheckOut = () => {
    if (!checkOutHour || !checkOutMinute) {
      message.warning('Please enter Check-Out time.');
      return;
    }

    const checkOutTime = convertTo24HourFormat(checkOutHour, checkOutMinute, checkOutMeridiem);
    const totalHours = calculateTotalHours(checkInTime, checkOutTime);

    const newEntry = {
      key: Date.now(),
      name: "Shajeed Muskin",
      date: new Date().toLocaleDateString(),
      checkIn: checkInTime,
      checkOut: checkOutTime,
      type: workType,
      totalHours
    };

    const updated = [...attendance, newEntry];
    setAttendance(updated);
    localStorage.setItem('attendance', JSON.stringify(updated));
    message.success('Attendance recorded!');
    resetFields();
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

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Check In', dataIndex: 'checkIn', key: 'checkIn' },
    { title: 'Check Out', dataIndex: 'checkOut', key: 'checkOut' },
    { title: 'Work Type', dataIndex: 'type', key: 'type' },
    { title: 'Total Hours', dataIndex: 'totalHours', key: 'totalHours' },
  ];

  return (
    <Card
      title="Attendance"
      style={{
        maxWidth: 1000,
        margin: '2rem auto',
        padding: '2rem',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '1rem'
      }}
    >
      {/* Manual Check-In UI */}
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
            <Input
              type="number"
              placeholder="hh"
              value={checkInHour}
              onChange={(e) => setCheckInHour(e.target.value)}
              style={{ width: 60 }}
              min={1}
              max={12}
            />
            <span>:</span>
            <Input
              type="number"
              placeholder="mm"
              value={checkInMinute}
              onChange={(e) => setCheckInMinute(e.target.value)}
              style={{ width: 60 }}
              min={0}
              max={59}
            />
            <Select value={checkInMeridiem} onChange={setCheckInMeridiem} style={{ width: 80 }}>
              <Option value="AM">AM</Option>
              <Option value="PM">PM</Option>
            </Select>

            <Button onClick={fillCurrentCheckInTime}>Now</Button>

            <Button
              type="primary"
              onClick={handleCheckIn}
              style={{ backgroundColor: '#2e3b55', borderRadius: '0.4rem', padding: '0 2rem' }}
            >
              Check-In
            </Button>
          </div>
        </div>

        {isCheckedIn && (
          <div>
            <h3 style={{ marginBottom: 12 }}>Check-Out</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ fontWeight: 'bold' }}>Enter Time:</label>
              <Input
                type="number"
                placeholder="hh"
                value={checkOutHour}
                onChange={(e) => setCheckOutHour(e.target.value)}
                style={{ width: 60 }}
                min={1}
                max={12}
              />
              <span>:</span>
              <Input
                type="number"
                placeholder="mm"
                value={checkOutMinute}
                onChange={(e) => setCheckOutMinute(e.target.value)}
                style={{ width: 60 }}
                min={0}
                max={59}
              />
              <Select value={checkOutMeridiem} onChange={setCheckOutMeridiem} style={{ width: 80 }}>
                <Option value="AM">AM</Option>
                <Option value="PM">PM</Option>
              </Select>

              <Button
                type="primary"
                onClick={handleCheckOut}
                style={{ backgroundColor: '#2e3b55', borderRadius: '0.4rem', padding: '0 2rem' }}
              >
                Check-Out
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Attendance History Table */}
      <Tabs defaultActiveKey="All" tabBarStyle={{ textAlign: 'center', fontWeight: 'bold' }}>
        <TabPane tab="All" key="All">
          <Table columns={columns} dataSource={attendance} pagination={false} rowKey="key" bordered size="middle" />
        </TabPane>
        {workTypes.map((type) => (
          <TabPane tab={type} key={type}>
            <Table
              columns={columns}
              dataSource={attendance.filter(entry => entry.type === type)}
              pagination={false}
              rowKey="key"
              bordered
              size="middle"
            />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
};

export default Attendance;
