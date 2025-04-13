import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

interface AuthState {
  token: string | null;
  username: string | null;
  error: Record<string, string>[] | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  username: null,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, password, second_password, tg }: any, thunkAPI) => {
    try {
      const res = await axios.post('/auth/register', {
        username,
        password,
        'second_password': second_password,
        tg,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: any, thunkAPI) => {
    try {
      const res = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.username = action.payload.username;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log(action.payload);
        state.error = action.payload as Record<string, string>[];
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as Record<string, string>[];
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
