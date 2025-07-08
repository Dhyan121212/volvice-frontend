import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import axios from 'axios';
import StyledCalendar from './StyledCalender';
import { fetchHolidays } from '../../../Redux/Slices/HolidaySlices';
import { fetchLeaves } from '../../../Redux/Slices/LeavesSlice';
import './CuustomCalender.css';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const LeaveRequest = () => {
  const dispatch = useDispatch();

  const holidays = useSelector((state) => state.holidays.data || []);
  const leaves = useSelector((state) => state.leaves.data || []);
  const [showAll, setShowAll] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);

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
    if (token && employeeId) {
      dispatch(fetchHolidays());
      dispatch(fetchLeaves());
      fetchLeaveTypes();
    }
  }, [token,  dispatch]);

  const fetchLeaveTypes = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/v1/leave/leave-request-template', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Grab the leave types from the first section
    const types = res.data?.sectionList?.[0]?.leaveTypes || [];
    setLeaveTypes(types);
  } catch (err) {
    console.error('Failed to fetch leave types:', err);
  }
};



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

  axios
    .post('http://localhost:8080/api/v1/leave/apply-leave', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      alert('Leave Applied Successfully');
      dispatch(fetchLeaves(employeeId));
    })
    .catch((err) => {
      console.error('❌ Apply leave failed:', err);
      alert('Failed to apply leave');
    });
};


  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Leave Request</h2>

      <div className="flex flex-col lg:flex-row items-start">
  {/* Calendar */}
  <div className="w-full lg:w-1/2">
    <StyledCalendar
      year={dayjs().year()}
      month={dayjs().month()}
      holidays={holidays}
      leaves={leaves}
    />
  </div>

          {/* Form */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-4">
              {/* Leave Type Dropdown */}
              <div>
                <label className="font-medium mr-2">Leave type :</label>
             <select
  name="leaveType"
  value={formData.leaveType}
  onChange={handleInputChange}
  className="border p-2 rounded w-1/2"
>
  <option value="">Select Type</option>
  {leaveTypes.map((type) => (
    <option key={type.code} value={type.code}>
      {type.name}
    </option>
  ))}
</select>


              </div>

              {/* Date Range */}
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
              </div>

              {/* Reason */}
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

              {/* Day Type */}
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

              {/* Document Upload */}
              {/* <div>
                <label className="font-medium mr-2">Documents :</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleInputChange}
                  className="border p-1 rounded"
                />
              </div> */}

              {/* Submit Button */}
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

        {/* Leave History */}
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
