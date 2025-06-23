import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import StyledCalendar from './StyledCalender';
import './CuustomCalender.css';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const LeaveRequest = () => {
  const [holidays, setHolidays] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    dayType: 'FULL',
    file: null,
  });

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
    if (!token || !employeeId) return;

    axios
      .get('http://localhost:8081/api/v1/holiday', {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((res) => setHolidays(res.data))
      .catch(() => alert('Failed to fetch holidays'));

    axios
      .get(`http://localhost:8081/api/v1/leave/employee/${employeeId}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((res) => setLeaves(res.data))
      .catch(() => alert('Failed to fetch leaves'));
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleApplyLeave = () => {
    const payload = {
      employeeId,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      dayType: formData.dayType,
    };

    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data',
      },
    };

    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => form.append(key, value));
    if (formData.file) form.append('document', formData.file);

    axios
      .post('http://localhost:8081/api/v1/leave', form, config)
      .then(() => {
        alert('Leave Applied Successfully');
        window.location.reload();
      })
      .catch(() => alert('Failed to apply leave'));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Leave Request</h2>

        {/* Calendar and Leave Form */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Calendar */}
          <div className="w-full lg:w-1/2">
            <StyledCalendar
              year={dayjs().year()}
              month={dayjs().month()}
              holidays={holidays}
              leaves={leaves}
            />
          </div>

          {/* Leave Form */}
          <div className="w-full lg:w-1/2 border-l border-gray-300 pl-6">
            <div className="space-y-4">
              <div>
                <label className="font-medium mr-2">Leave type :</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-1/2"
                >
                  <option value="">Select Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Optional Holiday">Optional Holiday</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <label className="font-medium">Select Date :</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                />
                <span className="text-gray-600">--</span>
              </div>

              <div>
                <label className="font-medium">Reason :</label>
                <textarea
                  name="reason"
                  maxLength="30"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="e.g. I am travelling to..."
                  className="w-full border rounded p-2 mt-1"
                />
              </div>

              <div>
                <label className="font-medium mr-4">Day :</label>
                <label className="mr-4">
                  <input
                    type="radio"
                    name="dayType"
                    value="FULL"
                    checked={formData.dayType === 'FULL'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Full Day</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="dayType"
                    value="HALF"
                    checked={formData.dayType === 'HALF'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Half Day</span>
                </label>
              </div>

              <div>
                <label className="font-medium mr-2">Documents :</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  className="border p-1 rounded"
                />
              </div>

              <div className="text-right">
                <button
                  onClick={handleApplyLeave}
                  className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700"
                >
                  Apply Leave
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leave History Table
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">Your Leave History</h3>
          <table className="w-full table-auto border rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Leave Type</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">End Date</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{leave.employeeId}</td>
                  <td className="p-2 border">{leave.leaveType}</td>
                  <td className="p-2 border">{dayjs(leave.startDate).format('DD-MM-YYYY')}</td>
                  <td className="p-2 border">{dayjs(leave.endDate).format('DD-MM-YYYY')}</td>
                  <td className="p-2 border">{leave.reason}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        leave.status === 'APPROVED'
                          ? 'bg-green-500'
                          : leave.status === 'REJECTED'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Leave Details Expandable Section */}
        <div className="mt-10">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Leave Details</h3>
            <button
              className="bg-cyan-100 text-cyan-800 px-4 py-1 rounded text-sm font-medium"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Collapse' : 'View All'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md mt-2">
            {(showAll ? leaves : leaves.slice(0, 5)).map((leave, index) => (
              <div
                key={index}
                className="p-4 border-b last:border-b-0 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{leave.leaveType}</div>
                  <div className="text-sm text-gray-500">
                    {dayjs(leave.startDate).format('DD-MM-YYYY')} -{' '}
                    {dayjs(leave.endDate).format('DD-MM-YYYY')}
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    leave.status === 'APPROVED'
                      ? 'text-green-600'
                      : leave.status === 'REJECTED'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {leave.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
