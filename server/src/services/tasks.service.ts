import { db } from '../db/database.js';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../models/task.js';

type TaskRow = {
  id: number;
  title: string;
  completed: number;
  created_at: string;
  updated_at: string;
};

const mapTaskRow = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  completed: Boolean(row.completed),
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const getAllTasks = (): Task[] => {
  const rows = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC, id DESC').all() as TaskRow[];
  return rows.map(mapTaskRow);
};

export const getTaskById = (id: number): Task | null => {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as TaskRow | undefined;
  return row ? mapTaskRow(row) : null;
};

export const createTask = (input: CreateTaskInput): Task => {
  const title = input.title.trim();

  const result = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title);
  return getTaskById(Number(result.lastInsertRowid)) as Task;
};

export const updateTask = (id: number, input: UpdateTaskInput): Task | null => {
  const existingTask = getTaskById(id);

  if (!existingTask) {
    return null;
  }

  const nextTitle = input.title !== undefined ? input.title.trim() : existingTask.title;
  const nextCompleted = input.completed !== undefined ? Number(input.completed) : Number(existingTask.completed);

  db.prepare(
    `
    UPDATE tasks
    SET title = ?,
        completed = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `
  ).run(nextTitle, nextCompleted, id);

  return getTaskById(id);
};

export const deleteTask = (id: number): boolean => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
};

export const clearCompletedTasks = (): number => {
  const result = db.prepare('DELETE FROM tasks WHERE completed = 1').run();
  return result.changes;
};
