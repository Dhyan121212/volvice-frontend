import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/AuthSlice';
import attendanceReducers from './Slices/AttendanceSlice';
import holidayReducers from './Slices/HolidaySlices';
import leavesReducers from './Slices/LeavesSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance:attendanceReducers,
    holidays:holidayReducers,
    leaves:leavesReducers

  },
});
