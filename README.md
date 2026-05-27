# Project Task Manager

A full-stack task management application built for a job interview coding exercise. The app demonstrates CRUD operations, backend persistence, state management, validation, error handling, and automated backend API tests.

## Features

- Add new tasks
- Mark tasks complete or incomplete
- Edit existing task titles
- Delete tasks with confirmation
- Filter tasks by all, active, or completed status
- Display remaining task count
- Clear all completed tasks
- Prevent empty and duplicate task titles
- Persist task data with SQLite
- Dark black/green UI theme with off-white text
- Backend API tests for critical paths and edge cases

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Vitest setup for frontend testing support
- Testing Library dependencies prepared for UI tests

### Backend

- Node.js
- Express
- TypeScript
- SQLite using better-sqlite3
- Vitest
- Supertest

## Why This Stack

React and Vite keep the frontend fast, lightweight, and easy to review. Express keeps the backend API simple and understandable. SQLite provides real data persistence without requiring reviewers to install or configure a separate database server. TypeScript is used on both sides to improve maintainability and catch mistakes earlier.

## Project Structure

    Project-Task-Manager/
      client/
        src/
          api/
            tasksApi.ts
          components/
            TaskFilters.tsx
            TaskForm.tsx
            TaskItem.tsx
          types/
            task.ts
          App.tsx
          main.tsx
          styles.css
        tests/
          setup.ts

      server/
        src/
          controllers/
            tasks.controller.ts
          db/
            database.ts
            schema.ts
          models/
            task.ts
          routes/
            tasks.routes.ts
          services/
            tasks.service.ts
          app.ts
          server.ts
        tests/
          tasks.api.test.ts

## Getting Started

### Prerequisites

- Node.js
- npm

### Install Dependencies

    npm install

### Run the Backend

    npm run dev --workspace server

The backend runs at:

    http://localhost:3001

### Run the Frontend

Open a second terminal:

    npm run dev --workspace client

The frontend runs at:

    http://localhost:5173

The frontend uses Vite's development proxy to send /api requests to the backend.

## Available Scripts

### Root

    npm test

Runs the backend API test suite.

### Backend

    npm run dev --workspace server
    npm run build --workspace server
    npm test --workspace server

### Frontend

    npm run dev --workspace client
    npm run build --workspace client
    npm test --workspace client

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/health | Confirms the API is running |
| GET | /api/tasks | Returns all tasks |
| POST | /api/tasks | Creates a new task |
| PATCH | /api/tasks/:id | Updates a task title and/or completion state |
| DELETE | /api/tasks/:id | Deletes a task |
| DELETE | /api/tasks/completed | Deletes completed tasks |

## Data Model

    type Task = {
      id: number;
      title: string;
      completed: boolean;
      createdAt: string;
      updatedAt: string;
    };

## Validation and Error Handling

The backend validates task input and returns clear error responses for invalid data. The frontend also performs user-friendly checks before sending requests, including empty-title and duplicate-title prevention.

Examples handled:

- Empty task title
- Task title over 200 characters
- Invalid task id
- Updating a missing task
- Deleting a missing task
- Invalid completed value
- Duplicate task titles in the UI

## Testing

Backend tests are located in:

    server/tests/tasks.api.test.ts

The test suite covers:

- Empty task list
- Task creation
- Empty title rejection
- Completion toggle
- Title editing
- Missing task update
- Invalid completed values
- Missing task delete
- Task deletion
- Clearing completed tasks

Run tests with:

    npm test

## Local Data

SQLite data is stored locally under:

    server/data/

This folder is intentionally ignored by Git so local test data is not committed.

## AI Tooling Note

AI tooling was used as a development assistant for planning, debugging, refactoring guidance, and test coverage ideas. All code was reviewed during implementation, tested locally, and kept structured so the project can be explained clearly during a technical walkthrough.

## Future Improvements

- Add frontend component tests
- Replace browser confirm dialogs with custom modal components
- Add due dates or priority labels
- Add sorting options
- Add deployment instructions
