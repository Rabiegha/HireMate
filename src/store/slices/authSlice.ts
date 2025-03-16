import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  timeStamp: number | null,
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  timeStamp: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.timeStamp = Date.now();
      state.loading = false;
      state.error = null;
      localStorage.setItem('authTimeStamp', JSON.stringify(state.timeStamp)); // save the timestamp to local storage
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.timeStamp = null;
      localStorage.removeItem('authTimeStamp');
    }
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;