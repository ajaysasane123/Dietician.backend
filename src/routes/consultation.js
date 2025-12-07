const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// Create consultation request
router.post('/', auth, async (req,res) => {
  try{
    const { date, notes } = req.body;
    const [result] = await pool.query('INSERT INTO consultations (user_id, date, notes) VALUES (?,?,?)',[req.user.id, date, notes]);
    res.json({id: result.insertId, user_id: req.user.id, date, notes});
  }catch(err){console.error(err); res.status(500).json({error:'Server error'})}
});

// Get user's consultations
router.get('/', auth, async (req,res) => {
  try{
    const [rows] = await pool.query('SELECT id, date, notes, status, created_at FROM consultations WHERE user_id=? ORDER BY created_at DESC',[req.user.id]);
    res.json(rows);
  }catch(err){console.error(err); res.status(500).json({error:'Server error'})}
});

module.exports = router;
