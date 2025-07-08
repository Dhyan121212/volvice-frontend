import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  employee: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.employee = action.payload.employee;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.employee = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
