import type { CreateTaskRequest, Task, UpdateTaskRequest } from '../types/task';

const API_BASE_URL = '/api/tasks';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? 'An unexpected API error occurred.';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_BASE_URL);
  return handleResponse<Task[]>(response);
};

export const createTask = async (input: CreateTaskRequest): Promise<Task> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  return handleResponse<Task>(response);
};

export const updateTask = async (id: number, input: UpdateTaskRequest): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  return handleResponse<Task>(response);
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? 'Unable to delete task.';
    throw new Error(message);
  }
};

export const clearCompletedTasks = async (): Promise<{ deletedCount: number }> => {
  const response = await fetch(`${API_BASE_URL}/completed`, {
    method: 'DELETE'
  });

  return handleResponse<{ deletedCount: number }>(response);
};
