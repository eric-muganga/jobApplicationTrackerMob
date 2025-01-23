import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../api/apiService.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {RootState} from './store.ts';

export interface User {
  firstName: string;
  fullName: string;
  email: string;
  password?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordUpdatePayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

const initialState:AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Helper function for error handling
const extractErrorMessage = (error: unknown): string =>
  (error as any)?.response?.data || (error as Error).message || 'Unknown error';

// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/User/create', userData);
      return response.data;
    } catch (error : unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('Logging in with credentials:', credentials);
      const response = await axios.post('http://10.0.2.2:5000/api/User/login', credentials);

      console.log('Login response:', response.data);
      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.token);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle error response
      const errorMessage = error.response?.data || error.message || 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  }
);

// Change Password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ email, oldPassword, newPassword }: PasswordUpdatePayload, { rejectWithValue }) => {
    try {
      console.log('Changing password for:', email);
      const response = await apiClient.post('/User/changePassword', {
        email,
        oldPassword,
        newPassword,
      });
      console.log('Change password response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // Login User
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // Change Password
    .addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;
export const selectUser = (state: RootState) =>state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

