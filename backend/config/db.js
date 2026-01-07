import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taskflow',
  password: process.env.DB_PASSWORD || 'password',
  port: Number.parseInt(process.env.DB_PORT || '5432'),
});

export const initDb = async () => {
  try {
    // Basic connectivity check
    await pool.query('SELECT NOW()');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'Pending',
        is_ai_enhanced BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ PostgreSQL Database connected and schema initialized');
  } catch (err) {
    console.warn('⚠️ Database connection failed. Backend will run in ephemeral mode if DB is missing.');
    console.warn('DB error:', err?.message || err);
  }
};
