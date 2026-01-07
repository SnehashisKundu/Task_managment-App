import { pool } from '../config/db.js';

/* ---------------- GET TASKS ---------------- */
export const getTasks = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );

    const tasks = result.rows.map(row => ({
      ...row,
      createdAt: row.created_at,
      isAiEnhanced: row.is_ai_enhanced,
    }));

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/* ---------------- CREATE TASK ---------------- */
export const createTask = async (req, res, next) => {
  const { title, description, isAiEnhanced } = req.body;

  // ✅ validation AFTER destructuring
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO tasks (title, description, is_ai_enhanced, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        title,
        description || "",
        isAiEnhanced ?? false,
        "Pending"   // 🔥 enum + DB aligned
      ]
    );

    const newTask = {
      ...result.rows[0],
      createdAt: result.rows[0].created_at,
      isAiEnhanced: result.rows[0].is_ai_enhanced,
    };

    // socket emit
    const io = req.app.get("io");
    if (io) io.emit("taskCreated", newTask);

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE STATUS ---------------- */
export const updateTaskStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    const allowed = ['Pending', 'In Progress', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = {
      ...result.rows[0],
      createdAt: result.rows[0].created_at,
      isAiEnhanced: result.rows[0].is_ai_enhanced,
    };

    const io = req.app.get('io');
    if (io) io.emit('taskUpdated', updatedTask);

    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
};

/* ---------------- DELETE TASK ---------------- */
export const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const io = req.app.get('io');
    if (io) io.emit('taskDeleted', id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
