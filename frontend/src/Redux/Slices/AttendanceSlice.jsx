import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch check-in template
export const fetchCheckInTemplate = createAsyncThunk(
  'attendance/fetchCheckInTemplate',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/attendance/check-in-template`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch template');
    }
  }
);

// Async thunk to fetch attendance records
export const fetchAttendanceData = createAsyncThunk(
  'attendance/fetchAttendanceData',
  async (employeeId, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/attendance/records?employeeId=${employeeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch attendance');
    }
  }
);

const initialState = {
  workType: '',
  isCheckedIn: false,
  attendanceData: [],
  checkInTemplate: null,
  templateLoading: false,
  templateError: null,
  attendanceLoading: false,
  attendanceError: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setWorkType: (state, action) => {
      state.workType = action.payload;
    },
    setIsCheckedIn: (state, action) => {
      state.isCheckedIn = action.payload;
    },
    setAttendanceData: (state, action) => {
      state.attendanceData = action.payload;
    },
    addAttendanceEntry: (state, action) => {
      state.attendanceData.push(action.payload);
    },
    clearAttendanceData: (state) => {
      state.attendanceData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Check-In Template
      .addCase(fetchCheckInTemplate.pending, (state) => {
        state.templateLoading = true;
        state.templateError = null;
      })
      .addCase(fetchCheckInTemplate.fulfilled, (state, action) => {
        state.templateLoading = false;
        state.checkInTemplate = action.payload;
      })
      .addCase(fetchCheckInTemplate.rejected, (state, action) => {
        state.templateLoading = false;
        state.templateError = action.payload;
      })

      // Attendance Data
      .addCase(fetchAttendanceData.pending, (state) => {
        state.attendanceLoading = true;
        state.attendanceError = null;
      })
      .addCase(fetchAttendanceData.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceData = action.payload;
      })
      .addCase(fetchAttendanceData.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceError = action.payload;
      });
  },
});

export const {
  setWorkType,
  setIsCheckedIn,
  setAttendanceData,
  addAttendanceEntry,
  clearAttendanceData,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
