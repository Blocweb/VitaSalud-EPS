import { Pool } from 'pg';
import { env } from './env';

const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.database,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Query took ${duration}ms - Query: ${text.substring(0, 100)}`);
    }
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = () => {
  return pool.connect();
};

export const closePool = async () => {
  await pool.end();
};

export default pool;
