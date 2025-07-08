// src/components/Employee/Attendance/AttendanceTab.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setWorkType,
  setIsCheckedIn,
  addAttendanceEntry,
} from '../../../Redux/Slices/AttendanceSlice';
import axios from 'axios';

const workTypes = [
  'Work from Office',
  'Work from Home',
  'Client Office',
  'Leave',
  'Manual Check-in',
];

const AttendanceTab = () => {
  const [time, setTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(null);

  const dispatch = useDispatch();
  const selectedWorkType = useSelector((state) => state.attendance.workType);
  const isCheckedIn = useSelector((state) => state.attendance.isCheckedIn);

  const token = localStorage.getItem('token');
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    const stored = localStorage.getItem('checkInTime');
    if (stored) {
      const restoredTime = new Date(stored);
      setCheckInTime(restoredTime);
      dispatch(setIsCheckedIn(true)); // ✅ Sync Redux if reloaded
    }

    return () => clearInterval(timer);
  }, [dispatch]);

  const formatTime12Hour = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    localStorage.setItem('checkInTime', now.toISOString()); // ✅ Persist
    dispatch(setIsCheckedIn(true));
    alert(`Checked In at ${formatTime12Hour(now)}`);
  };

  const handleCheckOut = async () => {
    if (!checkInTime) {
      alert('Check-in time is missing.');
      return;
    }

    const now = new Date();
    const totalHours = ((now - checkInTime) / (1000 * 60 * 60)).toFixed(2);

    const checkInFormatted = formatTime12Hour(checkInTime);
    const checkOutFormatted = formatTime12Hour(now);

    const checkInRequest = {
      employeeId: employee.empId,
      employeeName: employee.name,
      date: now.toISOString().split('T')[0],
      checkInTime: checkInFormatted,
      workType: selectedWorkType,
    };

    const checkOutRequest = {
      checkOutTime: checkOutFormatted,
    };

    try {
      await axios.post('http://localhost:8080/api/v1/attendance/check-in', checkInRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post('http://localhost:8080/api/v1/attendance/check-out', checkOutRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const entry = {
        ...checkInRequest,
        checkOutTime: checkOutFormatted,
        totalHours,
      };

      dispatch(addAttendanceEntry(entry));
      dispatch(setIsCheckedIn(false));
      setCheckInTime(null);
      localStorage.removeItem('checkInTime'); // ✅ Clear on logout
      alert('Check-Out successful!');
    } catch (err) {
      console.error('Check-Out failed:', err);
      alert('Check-Out failed');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-2xl shadow-md bg-white w-72">
      <h2 className="text-lg font-semibold">Attendance</h2>
      <p className="text-sm text-gray-500">{time.toDateString()}</p>
      <div className="text-2xl font-bold my-2">{time.toLocaleTimeString()}</div>

      {!isCheckedIn ? (
        <>
          <div className="w-full mb-2">
            <label className="block text-sm font-medium mb-1">Select Work Type</label>
            <select
              value={selectedWorkType}
              onChange={(e) => dispatch(setWorkType(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {workTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCheckIn}
            className="mt-4 px-4 py-2 bg-gray-300 text-white rounded-lg hover:bg-gray-600"
          >
            Check-In
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-blue-600 font-medium">
            Checked in at: {formatTime12Hour(checkInTime)}
          </p>
          <p className="text-sm text-blue-600 font-medium">Work Type: {selectedWorkType}</p>
          <button
            onClick={handleCheckOut}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Check-Out
          </button>
        </>
      )}
    </div>
  );
};

export default AttendanceTab;
