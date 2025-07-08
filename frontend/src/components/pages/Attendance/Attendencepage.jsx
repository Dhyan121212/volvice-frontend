import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, TimePicker, Button, Table, Tabs, message } from 'antd';
import dayjs from 'dayjs';
import {
  fetchCheckInTemplate,
  fetchAttendanceData,
  setWorkType,
} from '../../../Redux/Slices/AttendanceSlice';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;

const AttendencePage = () => {
  const dispatch = useDispatch();
  const {
    checkInTemplate,
    attendanceData,
    workType,
    isCheckedIn,
    templateLoading,
  } = useSelector((state) => state.attendance);

  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [todayCheckInDone, setTodayCheckInDone] = useState(false);
  const [todayCheckOutDone, setTodayCheckOutDone] = useState(false);
  const [filterKey, setFilterKey] = useState('All');

  const employeeId = localStorage.getItem('employeeId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    dispatch(fetchCheckInTemplate());
    dispatch(fetchAttendanceData(employeeId));
  }, [dispatch]);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const todayRecord = attendanceData.find((rec) => rec.date === today);

    if (todayRecord) {
      setTodayCheckInDone(!!todayRecord.checkInTime);
      setTodayCheckOutDone(!!todayRecord.checkOutTime);
    }
  }, [attendanceData]);

  const handleCheckIn = async () => {
    if (!checkInTime || !workType) {
      message.error('Please select time and work type');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/v1/attendance/check-in`,
        {
          employeeId,
          checkInTime: dayjs(checkInTime).format('hh:mm A'),
          workType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success('Checked in successfully!');
      setTodayCheckInDone(true);
      dispatch(fetchAttendanceData(employeeId));
    } catch (error) {
      message.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!checkOutTime) {
      message.error('Please select check-out time');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/v1/attendance/check-out`,
        {
          employeeId,
          checkOutTime: dayjs(checkOutTime).format('hh:mm A'),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success('Checked out successfully!');
      setTodayCheckOutDone(true);
      dispatch(fetchAttendanceData(employeeId));
    } catch (error) {
      message.error('Failed to check out');
    }
  };

  const filteredData =
    filterKey === 'All'
      ? attendanceData
      : attendanceData.filter((item) => item.workType === filterKey);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => dayjs(date).format('DD-MM-YYYY'),
    },
    {
      title: 'Check-In Time',
      dataIndex: 'checkInTime',
    },
    {
      title: 'Check-Out Time',
      dataIndex: 'checkOutTime',
    },
    {
      title: 'Work Type',
      dataIndex: 'workType',
    },
    {
      title: 'Total Hours',
      dataIndex: 'totalHours',
      render: (text) => text || '-',
    },
  ];

  // Extract work type options from template
  const workTypeOptions =
    checkInTemplate?.sectionList?.find((s) => s.title === 'Work Type')?.workType || [];

  if (templateLoading) return <p>Loading check-in template...</p>;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px' }}>ATTENDANCE</h1>

      <div
        style={{
          background: '#f9f9f9',
          padding: '24px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        {!todayCheckInDone ? (
          <>
           <Select
  value={workType}
  onChange={(val) => dispatch(setWorkType(val))}
  style={{ width: 180 }}
>
  {checkInTemplate?.sectionList
    ?.find((s) => s.title === 'Work Type')
    ?.workType?.map((opt) => (
      <Option key={opt.code} value={opt.code}>
        {opt.name}
      </Option>
    ))}
</Select>


            <TimePicker
              use12Hours
              format="hh:mm A"
              value={checkInTime}
              onChange={setCheckInTime}
              style={{ width: 140 }}
            />

            <Button type="primary" onClick={handleCheckIn}>
              Check-In
            </Button>
          </>
        ) : !todayCheckOutDone ? (
          <>
            <TimePicker
              use12Hours
              format="hh:mm A"
              value={checkOutTime}
              onChange={setCheckOutTime}
              style={{ width: 140 }}
            />

            <Button type="primary" onClick={handleCheckOut}>
              Check-Out
            </Button>
          </>
        ) : (
          <p style={{ fontWeight: '500', color: 'green', margin: 0 }}>
            ✅ You have checked in and out today.
          </p>
        )}
      </div>

      <Tabs defaultActiveKey="All" onChange={setFilterKey} style={{ marginBottom: '16px' }}>
        <TabPane tab="All" key="All" />
        <TabPane tab="WFH" key="WFH" />
        <TabPane tab="WFO" key="WFO" />
        <TabPane tab="Client Office" key="CLIENT" />
        <TabPane tab="Leave" key="Leave" />
      </Tabs>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey={(record, index) => index}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AttendencePage;
