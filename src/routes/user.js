const express = require('express');
const router = express.Router();
const pool = require('../db'); // ✅ correct
const auth = require('../middleware/authMiddleware');

router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,name,email,created_at FROM users WHERE id=?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
