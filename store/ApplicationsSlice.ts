import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import apiClient from '../api/apiService.ts';


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
  applicationDate?: string;
  interviewDate?: string | null;
  notes: string;
  contractType: string;
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
  applicationDate?: string;
  interviewDate?: string | null;
  notes: string;
  jobDescription?: string;
  createdAt: string;
  financialInformation: FinancialInformation | null;
  location?: string;
}

// Columns shape: each stage holds an array of application IDs
interface Columns {
  Wishlist: string[];
  Applied: string[];
  Interviewing: string[];
  Offer: string[];
  Rejected: string[];
}

// Redux slice state
export interface ApplicationsState {
  items: Record<string, JobApplication>;
  columns: Columns;
  loading: boolean;
  error: string | null;
}

// ServiceResponse shape from your backend
interface ServiceResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
  errorMessages?: string[] | null;
}

// Start with empty arrays
const initialColumns: Columns = {
  Wishlist: [],
  Applied: [],
  Interviewing: [],
  Offer: [],
  Rejected: [],
};

// Demo applications array (if you have no actual data initially)
const DEMO_APPLICATIONS: JobApplication[] = [];

// Helper to build initial store state from an array of applications
function buildInitialDemoState(
  applications: JobApplication[]
): ApplicationsState {
  const newItems: Record<string, JobApplication> = {};
  const newColumns: Columns = {
    Wishlist: [...initialColumns.Wishlist],
      Applied: [...initialColumns.Applied],
      Interviewing: [...initialColumns.Interviewing],
      Offer: [...initialColumns.Offer],
      Rejected: [...initialColumns.Rejected],
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
const initialState: ApplicationsState =
  buildInitialDemoState(DEMO_APPLICATIONS);

// Thunk: fetch applications from your API
export const fetchApplications = createAsyncThunk(
  'jobApplications/fetchApplications',
  async () => {
    const response = await apiClient.get<ServiceResponse<JobApplication[]>>(
      '/JobApplication'
    );
    // The server returns { data: [...], message: "...", statusCode: ..., success: ... }
    // We only need the array of JobApplication
    console.log(response.data);
    return response.data.data;
  }
);

//thunk: update application
export const updateApplications = createAsyncThunk(
  'jobApplications/update',
  async ({ applicationToUpdate }: { applicationToUpdate: JobApplication }) => {
    const response = await apiClient.put<ServiceResponse<JobApplication>>(
      '/JobApplication',
      applicationToUpdate
    );
    console.log(response.data);
    return response.data.data;
  }
);

// thunk: delete Application
export const deleteApplication = createAsyncThunk(
  'jobApplications/delete',
  async ({ id }: { id: string }) => {
    const response = await apiClient.delete<
      ServiceResponse<JobApplication>
    >(`/JobApplication/${id}`);

    console.log(response.data);
    return response.data.data;
  }
);

// Thunk: update application status
export const updateApplicationStatus = createAsyncThunk(
  'jobApplications/updateStatus',
  async ({ id, statusId }: { id: string; statusId: string }) => {
    try {
      const response = await apiClient.patch<ServiceResponse<JobApplication>>(
        `/JobApplication/${id}/status/${statusId}`
      );
      return response.data.data;
    } catch (error: unknown) {
      console.error('Failed to update status:', error.response || error.message);
    }
  }
);

// Thunk: create a new job application
export const createApplication = createAsyncThunk(
  'jobApplications/createApplication',
  async (newApplication: NewApplicationPayload) => {
    const response = await apiClient.post<ServiceResponse<JobApplication>>(
      '/JobApplication',
      newApplication
    );
    // The server returns the entire ServiceResponse, but we only want the job application
    return response.data.data;
  }
);

// The slice
const jobApplicationsSlice = createSlice({
  name: 'jobApplications',
  initialState,
  reducers: {
    // Reorder items within the same column
    reorderColumn(
      state,
      action: PayloadAction<{
        column: Stage;
        reorderedItems: string[];
      }>
    ) {
      const { column, reorderedItems } = action.payload;
      state.columns[column] = reorderedItems;
    },
    // Move item across columns
    moveItem(
      state,
      action: PayloadAction<{
        itemId: string;
        sourceColumn: Stage;
        destColumn: Stage;
      }>
    ) {
      const { itemId, sourceColumn, destColumn } = action.payload;
      // remove from source
      const sourceItems = state.columns[sourceColumn];
      const index = sourceItems.indexOf(itemId);
      if (index !== -1) {
        sourceItems.splice(index, 1);
      }
      // add to destination
      state.columns[destColumn].push(itemId);

      // update the app's status
      if (state.items[itemId]) {
        state.items[itemId].status = destColumn;
      }
    },
    // Add a new application directly (used if you want to insert it without an API call)
    addApplication(state, action: PayloadAction<JobApplication>) {
      const newApp = action.payload;
      state.items[newApp.id] = newApp;
      state.columns[newApp.status].push(newApp.id);
    },
  },
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
        const newApp = action.payload; // single JobApplication
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

export const { reorderColumn, moveItem, addApplication } =
  jobApplicationsSlice.actions;
export const selectApplications = (state: RootState) => state.jobApplications;

export default jobApplicationsSlice.reducer;
