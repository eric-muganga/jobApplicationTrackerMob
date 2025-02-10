# Technical Documentation: Job Application Tracker

## 1. Introduction
The **Job Application Tracker** project is a mobile app designed to assist job seekers in managing and organizing their job applications. The app consolidates job application data, providing a central platform for users to track the progress of each application, visualize trends, and stay organized during their job search.

This document covers the mobile application component of the project, detailing the technologies used, key features, and architecture.

## 2. Project Overview

### Purpose
- **Simplify the job application process** by consolidating all relevant data in one place.
- Provide users with a **clear overview** of their job-seeking progress using Kanban boards and dashboard charts.

### Scope
- **Mobile Client**: Built using **React Native** and **TypeScript** for cross-platform development.
- **Backend API**: Powered by an **ASP.NET Core Web API** that handles user authentication and manages job application data. The backend code can be found [here](https://github.com/eric-muganga/jobApplicationTrackerApi).

### Key Features
- **User Authentication** with JWT tokens for secure login and session management.
- **CRUD Operations** for job applications: users can create, read, update, and delete applications.
- **Drag-and-drop Kanban Board** to track the status of applications visually.
- **Dashboard with charts** that display trends, such as the number of applications per month and the status distribution.
- **Secure Token Storage** using **AsyncStorage** for JWT token persistence.

## 3. Technologies Used

### 3.1 Mobile Application
- **React Native (v0.76.6)**: A cross-platform mobile framework for building iOS and Android apps with JavaScript/TypeScript.
- **TypeScript (v5.0.4)**: A strongly-typed superset of JavaScript that improves code readability and reduces runtime errors.
- **Redux Toolkit (@reduxjs/toolkit)**: A state management library that simplifies and standardizes state handling.
- **React Navigation**: A navigation library used to manage screen transitions within the app.
- **Axios**: HTTP client used to make REST API requests to the backend.
- **React Native Chart Kit**: Used for rendering visual charts such as monthly application counts and status trends.
- **React Native Draggable FlatList**: Implements drag-and-drop functionality for managing the Kanban board.
- **AsyncStorage**: A mechanism for storing data, such as JWT tokens, locally on the device for offline use.

### 3.2 Backend API (ASP.NET Core Web API)
- **ASP.NET Core (C#)**: Provides a secure backend API for handling user authentication and managing job application data.
- **Entity Framework & Database**: Typically uses **SQL Server** or another relational database for persistent storage.
- **CORS Configuration**: Allows mobile app requests from the Android emulator (e.g., `http://10.0.2.2:5000`).

## 4. Functionalities

### User Authentication
- **Login/Logout**: User credentials are validated by the ASP.NET Core backend, and a JWT token is returned on successful authentication.
- **JWT Token**: The token is stored in AsyncStorage and automatically included in each API request via Axios interceptors.

### Kanban Board
- **Visual Columns**: The board features columns for the various stages of job applications, including **Wishlist**, **Applied**, **Interviewing**, **Offer**, and **Rejected**.
- **Drag-and-Drop Cards**: Users can move job applications between columns to update their statuses.
- **Status Updates**: Status changes trigger API requests to update the backend.

### Dashboard & Analytics
- **Monthly Charts**: Displays a chart showing how many applications were submitted each month.
- **Status Counts**: Displays the number of applications in each stage, providing a visual summary of user progress.

### CRUD Operations
- **Fetch**: Retrieves all job applications belonging to the authenticated user.
- **Create**: Allows users to add a new job application with details such as company, job title, and application notes.
- **Update**: Edit existing applications, including status changes.
- **Delete**: Removes an application from the system, with an optional confirmation prompt.

### Data Persistence
- **AsyncStorage**: Securely stores JWT tokens on the device, ensuring the user stays authenticated even after closing the app.
- **Backend Database**: A relational database (such as SQL Server) stores job application data, ensuring data consistency and sync between the mobile app and the backend.

## 5. Architecture & Implementation
The app follows a modular folder structure, separating the components, API calls, and Redux store logic. The mobile app communicates with the backend API, which handles all job application data and user authentication. The Kanban board and charts are handled within the frontend, while the backend ensures data integrity and manages the user's job applications.

## 6. Usage & Workflow

**Installation Steps**:
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure the backend API endpoint (if necessary).
4. Run the app using `react-native run-android` or `react-native run-ios`.

**Workflow**:
- Users can register, log in, and begin adding job applications to the Kanban board.
- Applications can be updated or deleted, and their status can be tracked using the dashboard and the Kanban board.

## 7. Future Enhancements
- **Push Notifications**: Integrate Firebase for interview reminders and application follow-ups.
- **Calendar Sync**: Sync interview dates and follow-up reminders with Google Calendar or iCal.
- **Advanced Analytics**: Provide more detailed dashboards showing success rates by company or application timelines.

## 8. Conclusion
The Job Application Tracker mobile app offers a simple yet powerful way for job seekers to track their applications and visualize their job search progress. Built with React Native and TypeScript and backed by a secure ASP.NET Core Web API, the app ensures scalability and ease of use. Future enhancements will add more advanced features to further assist users in managing their job applications.
