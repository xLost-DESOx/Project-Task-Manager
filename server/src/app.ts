import cors from 'cors';
import express from 'express';

import { initializeDatabase } from './db/schema.js';

export const createApp = () => {
  const app = express();

  initializeDatabase();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Project Task Manager API is running'
    });
  });

  return app;
};
