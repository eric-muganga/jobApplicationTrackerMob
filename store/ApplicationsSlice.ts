import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import apiClient from '../api/apiService.ts';
import { fetchStatusCounts, fetchMonthlyApplications } from './dashboardSlice';
import axios from 'axios';

export type Stage =
  | 'Wishlist'
  | 'Applied'
  | 'Interviewing'
  | 'Offer'
  | 'Rejected';

// All possible stages
export const STAGES: Stage[] = [
  'Wishlist',
  'Applied',
  'Interviewing',
  'Offer',
  'Rejected',
];

// Columns shape: each stage holds an array of application IDs
interface Columns {
  Wishlist: string[];
  Applied: string[];
  Interviewing: string[];
  Offer: string[];
  Rejected: string[];
}

// Financial info model
export interface FinancialInformation {
  id?: string | null;
  salary: string;
  currency: string;
  salaryType: string;
  typeOfEmployment: string;
}

// Main job application model returned by the server
export interface JobApplication {
  id: string;
  company: string;
  jobTitle: string;
  status: Stage;
  statusId: string;
  contractTypeId: string;
  applicationDate?: string | null;
  interviewDate?: string | null;
  notes: string;
  contractType?: string;
  jobDescription?: string;
  createdAt: string;
  financialInformation: FinancialInformation;
  location?: string;
}

// Payload for creating a new job application (matches the .NET view model)
export interface NewApplicationPayload {
  company: string;
  jobTitle: string;
  statusId: string; // Must be a valid GUID
  contractTypeId: string; // Must be a valid GUID
  applicationDate?: string | null;
  interviewDate?: string | null;
  notes: string;
  jobDescription?: string;
  createdAt: string;
  financialInformation: FinancialInformation | null;
  location?: string;
}

// ServiceResponse shape from your backend
export interface ServiceResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
  errorMessages?: string[] | null;
}

// Columns shape: each stage holds an array of application IDs
interface Columns {
  Wishlist: string[];
  Applied: string[];
  Interviewing: string[];
  Offer: string[];
  Rejected: string[];
}

// Start with empty arrays
const initialColumns: Columns = {
  Wishlist: [],
  Applied: [],
  Interviewing: [],
  Offer: [],
  Rejected: [],
};

// Redux slice state
export interface ApplicationsState {
  items: Record<string, JobApplication>;
  columns: Columns;
  loading: boolean;
  error: string | null;
}

// Helper to build initial store state from an array of applications
function buildInitialState(
  applications: JobApplication[]
): ApplicationsState {
  const newItems: Record<string, JobApplication> = {};
  const newColumns: Columns = {
    Wishlist: [],
    Applied: [],
    Interviewing: [],
    Offer: [],
    Rejected: [],
  };

  for (const app of applications) {
    newItems[app.id] = app;
    if (STAGES.includes(app.status)) {
      newColumns[app.status].push(app.id);
    } else {
      console.warn('Unknown status:', app.status);
    }
  }

  return {
    items: newItems,
    columns: newColumns,
    loading: false,
    error: null,
  };
}

// Initial state
const initialState: ApplicationsState = buildInitialState([]);

// Thunk: fetch applications from your API
export const fetchApplications = createAsyncThunk(
  'jobApplications/fetchApplications',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.get<ServiceResponse<JobApplication[]>>('/JobApplication');
      dispatch(fetchStatusCounts());
      dispatch(fetchMonthlyApplications());
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch applications');
    }
  }
);

// Thunk: create a new job application
export const createApplication = createAsyncThunk(
  'jobApplications/createApplication',
  async (newApplication: NewApplicationPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.post<ServiceResponse<JobApplication>>('/JobApplication', newApplication);
      dispatch(fetchStatusCounts());
      dispatch(fetchMonthlyApplications());
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create application');
    }
  }
);

// Thunk: update application status
export const updateApplicationStatus = createAsyncThunk(
  'jobApplications/updateStatus',
  async ({ id, statusId }: { id: string; statusId: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.patch<ServiceResponse<JobApplication>>(
        `/JobApplication/${id}/status/${statusId}`
      );
      dispatch(fetchStatusCounts());
      dispatch(fetchMonthlyApplications());
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue('Failed to fetch applications');
    }
  }
);

// Thunk: update an application
export const updateApplications = createAsyncThunk(
  'jobApplications/updateApplications',
  async (
    { applicationToUpdate }: { applicationToUpdate: JobApplication },
    { dispatch, rejectWithValue }
  ) => {
    console.log('Application to update:', JSON.stringify(applicationToUpdate, null, 2));

    if (!applicationToUpdate.contractTypeId || applicationToUpdate.contractTypeId === '') {
      return rejectWithValue('Invalid contractTypeId');
    }

    try {
      const response = await apiClient.put<ServiceResponse<JobApplication>>('/JobApplication', applicationToUpdate);
      console.log('Update response:', response.data);
      dispatch(fetchStatusCounts());
      dispatch(fetchMonthlyApplications());
      if (!response.data.success) {
        return rejectWithValue(response.data.errorMessages);
      }

      // ✅ Dispatch fetch to update store after update
      dispatch(fetchApplications()); // Make sure this fetches all applications again
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update application');
    }
  }
);

// Thunk: delete an application
export const deleteApplication = createAsyncThunk(
  'jobApplications/deleteApplication',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.delete<
        ServiceResponse<JobApplication>
      >(`/JobApplication/${id}`);

      if (!response.data.success) {
        return rejectWithValue(response.data.errorMessages);
      }

      // ✅ Dispatch an action to refetch job applications after deletion
      dispatch(fetchApplications());
      dispatch(fetchStatusCounts());
      dispatch(fetchMonthlyApplications());
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete application');
    }
  }
);

// Slice definition
const jobApplicationsSlice = createSlice({
  name: 'jobApplications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchApplications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;

        const fetchedApps = action.payload; // array of JobApplication
        const newItems: Record<string, JobApplication> = {};
        const newColumns: Columns = {
          Wishlist: [...initialColumns.Wishlist],
          Applied: [...initialColumns.Applied],
          Interviewing: [...initialColumns.Interviewing],
          Offer: [...initialColumns.Offer],
          Rejected: [...initialColumns.Rejected],
        };

        // Distribute the apps based on 'status'
        for (const app of fetchedApps) {
          newItems[app.id] = app;
          if (STAGES.includes(app.status)) {
            newColumns[app.status].push(app.id);
          } else {
            console.warn('Unknown status', app.status);
          }
        }

        // Overwrite the store with fresh data
        state.items = newItems;
        state.columns = newColumns;
      })

      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch applications';
      })

      // updateApplicationStatus
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        // If the backend confirms the update, you can apply any final changes:
        const updatedApplication = action.payload; // Updated JobApplication from backend

        if (!updatedApplication || !updatedApplication.id || !updatedApplication.status) {
          console.warn('Invalid payload for updateApplicationStatus:', updatedApplication);
          return;
        }

        const { id, status } = updatedApplication;

        // Update the item's status
        if (state.items[id]) {
          const oldStatus = state.items[id].status;
          state.items[id].status = status;

          // Move the item to the new column
          const oldColumn = state.columns[oldStatus];
          const newColumn = state.columns[status];

          // Remove from the old column
          const index = oldColumn.indexOf(id);
          if (index !== -1) {oldColumn.splice(index, 1);}

          // Add to the new column
          newColumn.push(id);
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error =
          action.error.message || 'Failed to update application status.';
      })
      // createApplication
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        const newApp: JobApplication = action.payload; // single JobApplication
        state.loading = false;
        // Insert the new job application in store
        state.items[newApp.id] = newApp;
        state.columns[newApp.status].push(newApp.id);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create application';
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        const deletedId = action.payload.id;

        // Remove from items
        delete state.items[deletedId];

        // Remove from columns
        Object.keys(state.columns).forEach((key) => {
          const column = state.columns[key as Stage];
          const index = column.indexOf(deletedId);
          if (index !== -1) {
            column.splice(index, 1);
          }
        });
      });
  },
});

export const selectApplications = (state: RootState) => state.jobApplications;
export default jobApplicationsSlice.reducer;
