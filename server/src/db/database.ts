import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const databasePath = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'tasks.sqlite');
const databaseDirectory = path.dirname(databasePath);

fs.mkdirSync(databaseDirectory, { recursive: true });

export const db = new Database(databasePath);
