import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import apiClient from '../api/apiService.ts';

export interface Option {
  id: string;
  name: string;
}

export interface OptionState {
  contractTypes: Option[];
  statuses: Option[];
  loading: boolean;
  error: string | null;
}

const initialState: OptionState = {
  contractTypes: [],
  statuses: [],
  loading: false,
  error: null,
};

// thunks for fetching data
export const fetchContractTypes = createAsyncThunk(
  'options/fetchContractTypes',
  async () => {
    const response = await apiClient.get(
      'Lookup/contract-types'
    );
    console.log(response);
    return response.data;
  }
);

export const fetchStatuses = createAsyncThunk(
  'options/fetchStatuses',
  async () => {
    const response = await apiClient.get('/Lookup/statuses');
    console.log(response);
    return response.data;
  }
);

const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractTypes.fulfilled, (state, action) => {
        state.contractTypes = action.payload;
        state.loading = false;
      })
      .addCase(fetchContractTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contract types';
      })
      .addCase(fetchStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.statuses = action.payload;
        state.loading = false;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch statuses';
      });
  },
});

export const selectOptions = (state: RootState) => state.options;
export default optionsSlice.reducer;
