// src/Redux/Slices/LeavesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLeaves = createAsyncThunk(
  'leaves/fetchLeaves',
  async (employeeId, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/leave/leave-records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            // Optional: you can filter by employeeId or status if backend supports it
          },
        }
      );

      // ✅ Return just the array of leave records
      return res.data.records;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching leaves');
    }
  }
);

const leavesSlice = createSlice({
  name: 'leaves',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default leavesSlice.reducer;
