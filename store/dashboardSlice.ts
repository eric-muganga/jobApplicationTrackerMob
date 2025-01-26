import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the dashboard stats
export interface DashboardStats {
  total: number;
  wishlist: number;
  applied: number;
  interviewing: number;
  offer: number;
  rejected: number;
}

// Status Interface
export interface StatusWithCount {
  name: string;
  value: number;
}

// Define the shape of the monthly applications
export interface MonthlyApplication {
  month: string;
  applications: number;
}


// Define the shape of the dashboard state
interface DashboardState {
  stats: StatusWithCount[];
  monthlyApplications: MonthlyApplication[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: DashboardState = {
  stats: [],
  monthlyApplications: [],
  // Demo reminders
  loading: false,
  error: null,
};

// Async thunk to fetch status data
export const fetchStatusCounts = createAsyncThunk(
  'dashboard/fetchStatusCounts',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Fetch the token from localStorage
      const response = await axios.get('http://10.0.2.2:5000/api/JobApplication/statistics-by-statuses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);

      return response.data.data.map((status: any) => ({
        name: status.statusName,
        value: status.total,
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to load status data');
    }
  }
);

// Async thunk to fetch monthly applications data
export const fetchMonthlyApplications = createAsyncThunk(
  'dashboard/fetchMonthlyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        'http://10.0.2.2:5000/api/JobApplication/statistics-per-months',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      // Convert API response to the expected format
      return Object.entries(response.data.data).map(
        ([month, applications]) => ({
          month,
          applications: typeof applications === 'number' ? applications : 0,
        })
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to load monthly applications data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatusCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStatusCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMonthlyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyApplications = action.payload;
      })
      .addCase(fetchMonthlyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectStats = (state: RootState) => state.dashboard.stats;
export const selectMonthlyApplications = (state: RootState) =>
  state.dashboard.monthlyApplications;
export const selectLoading = (state: RootState) => state.dashboard.loading;
export const selectError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;
