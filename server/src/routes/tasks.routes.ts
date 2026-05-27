import { Router } from 'express';

import {
  clearCompletedTasksHandler,
  createTaskHandler,
  deleteTaskHandler,
  listTasksHandler,
  updateTaskHandler
} from '../controllers/tasks.controller.js';

export const tasksRouter = Router();

tasksRouter.get('/', listTasksHandler);
tasksRouter.post('/', createTaskHandler);
tasksRouter.patch('/:id', updateTaskHandler);
tasksRouter.delete('/completed', clearCompletedTasksHandler);
tasksRouter.delete('/:id', deleteTaskHandler);
