
import { pool } from '../config/db.js';

export const TaskModel = {
  getAll: async () => {
    try {
      const res = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      return res.rows;
    } catch (e) { 
      console.error('Error fetching tasks:', e);
      return []; 
    }
  },

  create: async (title, description, isAiEnhanced) => {
    const res = await pool.query(
      'INSERT INTO tasks (title, description, is_ai_enhanced) VALUES ($1, $2, $3) RETURNING *',
      [title, description, isAiEnhanced]
    );
    return res.rows[0];
  },

  updateStatus: async (id, status) => {
    const res = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return true;
  }
};
