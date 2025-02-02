import { configureStore } from '@reduxjs/toolkit';
import AuthRender from  './authSlice.ts';
import DashboardRender from  './dashboardSlice.ts';
import JobApplicationRender from './ApplicationsSlice.ts';
import OptionsRender from './optionsSlice.ts';

const store = configureStore({
  reducer: {
    auth: AuthRender,
    dashboard: DashboardRender,
    jobApplications: JobApplicationRender,
    options: OptionsRender,
  },
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
