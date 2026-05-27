# Design Notes

This document summarizes the design process, technical decisions, and cleanup steps used while building Project Task Manager.

## Assignment Goal

The goal was to build a simple full-stack todo application that demonstrates:

- CRUD operations
- Frontend state management
- Backend data persistence
- Input validation and edge-case handling
- Clean project organization
- Automated tests for critical behavior

The implementation focuses on correctness, readability, and being easy to explain during a technical interview.

## Step-by-Step Design Process

### 1. Repository and Workspace Setup

The project started with a clean Git repository and a root npm workspace. The workspace keeps the frontend and backend separated while still allowing shared root commands.

Structure chosen:

- `client/` for the React frontend
- `server/` for the Express API
- root `package.json` for workspace-level scripts

This keeps the project organized without adding unnecessary tooling.

### 2. Backend Foundation

The backend was built first because the assignment required data persistence through a backend.

Initial backend setup included:

- Express app setup
- JSON request parsing
- CORS support
- Health check endpoint
- TypeScript configuration
- SQLite database initialization

SQLite was selected because it provides real persistence without requiring a separate database server.

### 3. Database and Model Design

The task model was intentionally small and focused:

- `id`
- `title`
- `completed`
- `createdAt`
- `updatedAt`

The database stores completed state as an integer because SQLite does not have a dedicated boolean type. The service layer maps SQLite rows into frontend-friendly task objects.

### 4. Backend Layering

The backend is split into clear layers:

- `routes/` maps HTTP endpoints to handlers
- `controllers/` handles request validation and responses
- `services/` handles database operations
- `db/` owns database connection and schema setup
- `models/` contains shared backend types

This keeps route handling separate from persistence logic.

### 5. Backend Validation and Error Handling

The backend validates important edge cases:

- Empty task titles
- Titles over 200 characters
- Invalid task ids
- Invalid completed values
- Updating missing tasks
- Deleting missing tasks

The API returns clear status codes and error messages so the frontend can display useful feedback.

### 6. Backend Tests

Backend API tests were added with Vitest and Supertest.

The tests cover:

- Listing tasks
- Creating tasks
- Rejecting invalid titles
- Updating completion state
- Editing task titles
- Handling missing tasks
- Rejecting invalid completed values
- Deleting tasks
- Clearing completed tasks

The tests use a temporary SQLite database so local development data does not affect test results.

### 7. Frontend Foundation

The frontend was built with React, TypeScript, and Vite.

The first version confirmed:

- Vite setup works
- React renders correctly
- Build pipeline works
- Frontend can proxy API requests to the backend

### 8. Frontend Feature Implementation

The UI supports:

- Loading persisted tasks
- Adding tasks
- Toggling completed state
- Editing task titles
- Deleting tasks
- Filtering by all, active, and completed
- Clearing completed tasks
- Displaying remaining task count

The frontend performs user-friendly validation before making API calls for empty and duplicate task titles.

### 9. UI Design Direction

The UI uses a black and green visual style with off-white text. This was chosen to keep the app visually clean and distinct without making the interface overly complex.

Key styling decisions:

- Dark background
- Green accent color
- Off-white primary text
- Muted green-gray secondary text
- Scrollable task list to prevent the layout from growing indefinitely
- Visual distinction for completed tasks through opacity and strikethrough

### 10. User Safety and Confirmation Flows

Delete and edit actions include browser confirmation prompts.

This protects users from accidentally:

- Deleting a task immediately
- Saving an edit they did not intend to keep

A future improvement would be replacing browser confirm dialogs with custom modal components.

### 11. Cleanup and Refactoring

After the full app worked, cleanup mode focused on:

- Removing obsolete `.gitkeep` files
- Removing local TypeScript build cache
- Expanding the README
- Splitting large frontend UI sections into smaller components

Extracted frontend components:

- `TaskForm`
- `TaskFilters`
- `TaskItem`

This made `App.tsx` easier to read while keeping state management centralized.

## Tradeoffs

### Browser Confirm Dialogs

Browser confirmation dialogs are simple and reliable, but they are not visually customized. They were used to keep scope focused and avoid unnecessary UI complexity.

### Frontend Duplicate Prevention

Duplicate task prevention currently happens in the frontend. This gives immediate feedback to the user. A production version should also enforce this rule in the backend or database for stronger data integrity.

### SQLite

SQLite is a good fit for this assignment because it is simple and persistent. For a multi-user production application, the app would likely move to PostgreSQL or another server-based database.

### Centralized App State

Task state is still owned by `App.tsx`. For this project size, that is clear and easy to follow. If the app grew, state management could move into a custom hook such as `useTasks`.

## Current Quality Checks

Before the current cleanup checkpoint, the following passed:

- Root test command
- Backend TypeScript build
- Frontend TypeScript and Vite build
- Manual full-stack browser testing

## Future Improvements

High-value next steps would be:

- Add frontend component tests
- Add a custom confirmation modal
- Add backend duplicate title enforcement
- Add sorting by creation date or completion status
- Add task priority or due dates
- Add deployment instructions
