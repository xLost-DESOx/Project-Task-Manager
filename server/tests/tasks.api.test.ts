import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

let app: ReturnType<typeof import('../src/app.js').createApp>;
let tempDirectory: string;

beforeAll(async () => {
  tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'project-task-manager-test-'));
  process.env.DATABASE_PATH = path.join(tempDirectory, 'tasks.sqlite');

  const appModule = await import('../src/app.js');
  app = appModule.createApp();
});

beforeEach(async () => {
  const { db } = await import('../src/db/database.js');
  db.prepare('DELETE FROM tasks').run();
});

afterAll(async () => {
  const { db } = await import('../src/db/database.js');
  db.close();
  fs.rmSync(tempDirectory, { recursive: true, force: true });
});

describe('tasks API', () => {
  it('starts with an empty task list', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('creates a task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Write backend tests' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: 'Write backend tests',
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });

  it('rejects empty task titles', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Task title is required and must be 200 characters or fewer.');
  });

  it('updates task completion state', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Toggle this task' });

    const updateResponse = await request(app)
      .patch(`/api/tasks/${createResponse.body.id}`)
      .send({ completed: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.completed).toBe(true);
  });

  it('updates task title', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Old title' });

    const updateResponse = await request(app)
      .patch(`/api/tasks/${createResponse.body.id}`)
      .send({ title: 'New title' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('New title');
  });

  it('returns 404 when updating a missing task', async () => {
    const response = await request(app)
      .patch('/api/tasks/999')
      .send({ completed: true });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Task not found.');
  });

  it('deletes a task', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({ title: 'Delete this task' });

    const deleteResponse = await request(app).delete(`/api/tasks/${createResponse.body.id}`);
    const listResponse = await request(app).get('/api/tasks');

    expect(deleteResponse.status).toBe(204);
    expect(listResponse.body).toEqual([]);
  });

  it('clears completed tasks only', async () => {
    const activeTask = await request(app)
      .post('/api/tasks')
      .send({ title: 'Keep active task' });

    const completedTask = await request(app)
      .post('/api/tasks')
      .send({ title: 'Clear completed task' });

    await request(app)
      .patch(`/api/tasks/${completedTask.body.id}`)
      .send({ completed: true });

    const clearResponse = await request(app).delete('/api/tasks/completed');
    const listResponse = await request(app).get('/api/tasks');

    expect(clearResponse.status).toBe(200);
    expect(clearResponse.body.deletedCount).toBe(1);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(activeTask.body.id);
  });
});
