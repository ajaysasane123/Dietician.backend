const express = require('express');
const router = express.Router();
const pool = require('../db'); // ✅ correct
const auth = require('../middleware/authMiddleware');

router.post('/', auth, async (req, res) => {
  try {
    const { title, target_date, progress } = req.body;
    const [result] = await pool.query(
      'INSERT INTO goals (user_id,title,target_date,progress) VALUES (?,?,?,?)',
      [req.user.id, title, target_date, progress || 0]
    );
    res.json({
      id: result.insertId,
      title,
      target_date,
      progress: progress || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,title,target_date,progress,created_at FROM goals WHERE user_id=? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    await pool.query('UPDATE goals SET progress=? WHERE id=? AND user_id=?', [
      progress,
      req.params.id,
      req.user.id,
    ]);
    res.json({ id: req.params.id, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
