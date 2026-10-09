import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export const checkDatabaseHealth = async () => {
  try {
    const res = await pool.query('SELECT 1 AS status');
    return res.rows[0].status === 1;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

export default pool;
