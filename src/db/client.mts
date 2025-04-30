import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Validate environment variables
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined in environment variables');
}

if (!TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined in environment variables');
}

// Create database client using environment variables
export const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

/**
 * Initialize the database with the users table
 */
export async function initDb(): Promise<void> {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

/**
 * Execute a query and return a typed result
 */
export async function executeQuery<T>(sql: string, args?: Array<string | number | boolean | null>): Promise<T> {
  const result = await db.execute(sql, args);
  return result as unknown as T;
}

