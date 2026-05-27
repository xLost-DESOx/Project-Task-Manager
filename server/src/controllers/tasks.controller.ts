import type { Request, Response } from 'express';

import {
  clearCompletedTasks,
  createTask,
  deleteTask,
  getAllTasks,
  updateTask
} from '../services/tasks.service.js';

const MAX_TITLE_LENGTH = 200;

const isValidTitle = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= MAX_TITLE_LENGTH;
};

export const listTasksHandler = (_req: Request, res: Response) => {
  res.status(200).json(getAllTasks());
};

export const createTaskHandler = (req: Request, res: Response) => {
  const { title } = req.body as { title?: unknown };

  if (!isValidTitle(title)) {
    res.status(400).json({
      error: 'Task title is required and must be 200 characters or fewer.'
    });
    return;
  }

  const task = createTask({ title });
  res.status(201).json(task);
};

export const updateTaskHandler = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body as { title?: unknown; completed?: unknown };

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Task id must be a positive number.' });
    return;
  }

  if (title !== undefined && !isValidTitle(title)) {
    res.status(400).json({
      error: 'Task title must be 200 characters or fewer and cannot be empty.'
    });
    return;
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    res.status(400).json({ error: 'Completed must be true or false.' });
    return;
  }

  const updatedTask = updateTask(id, {
    title: title as string | undefined,
    completed: completed as boolean | undefined
  });

  if (!updatedTask) {
    res.status(404).json({ error: 'Task not found.' });
    return;
  }

  res.status(200).json(updatedTask);
};

export const deleteTaskHandler = (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Task id must be a positive number.' });
    return;
  }

  const wasDeleted = deleteTask(id);

  if (!wasDeleted) {
    res.status(404).json({ error: 'Task not found.' });
    return;
  }

  res.status(204).send();
};

export const clearCompletedTasksHandler = (_req: Request, res: Response) => {
  const deletedCount = clearCompletedTasks();
  res.status(200).json({ deletedCount });
};
