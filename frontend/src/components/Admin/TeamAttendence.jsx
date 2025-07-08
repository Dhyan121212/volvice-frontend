import React, { useEffect, useState } from 'react';

const TeamAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('attendance') || '[]');
    setAttendanceData(storedData);
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Team Attendance</h2>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Check In</th>
              <th className="py-3 px-6 text-left">Check Out</th>
              <th className="py-3 px-6 text-left">Work Type</th>
              <th className="py-3 px-6 text-left">Total Hours</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {attendanceData.map((entry, index) => (
              <tr key={entry.key || index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">{entry.date}</td>
                <td className="py-3 px-6">{entry.name}</td>
                <td className="py-3 px-6">{entry.checkIn}</td>
                <td className="py-3 px-6">{entry.checkOut}</td>
                <td className="py-3 px-6">{entry.type}</td>
                <td className="py-3 px-6">{entry.totalHours} hrs</td>
              </tr>
            ))}
            {attendanceData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamAttendance;
