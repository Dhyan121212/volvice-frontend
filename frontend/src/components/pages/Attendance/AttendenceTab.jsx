// AttendanceTab.js
import React, { useState, useEffect } from 'react';

const workTypes = [
  'Work from Office',
  'Work from Home',
  'Client Office',
  'Leave',
  'Manual Check-in',
];

const AttendanceTab = () => {
  const [time, setTime] = useState(new Date());
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState(workTypes[0]);
  const [checkInTime, setCheckInTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    if (!selectedWorkType) {
      alert('Please select a work type');
      return;
    }
    setCheckedIn(true);
    const now = new Date();
    setCheckInTime(now);
    localStorage.setItem('currentCheckIn', JSON.stringify({
      type: selectedWorkType,
      time: now.toISOString()
    }));
    alert(`Checked In: ${selectedWorkType}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const stored = JSON.parse(localStorage.getItem('currentCheckIn'));
    if (!stored) return;

    const checkInDate = new Date(stored.time);
    const totalHours = ((now - checkInDate) / (1000 * 60 * 60)).toFixed(2);

    const newEntry = {
      key: Date.now(),
      date: now.toLocaleDateString(),
      checkIn: checkInDate.toLocaleTimeString(),
      checkOut: now.toLocaleTimeString(),
      type: stored.type,
      totalHours
    };

    const existing = JSON.parse(localStorage.getItem('attendance') || '[]');
    localStorage.setItem('attendance', JSON.stringify([...existing, newEntry]));
    localStorage.removeItem('currentCheckIn');

    setCheckedIn(false);
    setCheckInTime(null);
    setSelectedWorkType(workTypes[0]);
    alert('Checked Out');
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-2xl shadow-md bg-white w-72">
      <h2 className="text-lg font-semibold">Attendance</h2>
      <p className="text-sm text-gray-500">{time.toDateString()}</p>
      <div className="text-2xl font-bold my-2">{time.toLocaleTimeString()}</div>

      {checkedIn ? (
        <>
          <p className="text-sm text-blue-600 font-medium">Work Type: {selectedWorkType}</p>
          <p className="text-sm text-gray-700">Checked in at: {checkInTime?.toLocaleTimeString()}</p>
        </>
      ) : (
        <div className="w-full mb-2">
          <label className="block text-sm font-medium mb-1">Select Work Type</label>
          <select
            value={selectedWorkType}
            onChange={(e) => setSelectedWorkType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {workTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {!checkedIn ? (
        <button
          onClick={handleCheckIn}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Check-In
        </button>
      ) : (
        <button
          onClick={handleCheckOut}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Check-Out
        </button>
      )}
    </div>
  );
};

export default AttendanceTab;
