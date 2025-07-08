// src/Redux/Slices/HolidaysSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to fetch holidays
export const fetchHolidays = createAsyncThunk(
  'holidays/fetchHolidays',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8080/api/v1/holidays', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch holidays');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice definition
const holidaysSlice = createSlice({
  name: 'holidays',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default holidaysSlice.reducer;
