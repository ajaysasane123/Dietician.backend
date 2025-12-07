const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signToken = (user) => jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name||!email||!password) return res.status(400).json({error:'Missing fields'});
    const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if(rows.length) return res.status(400).json({error:'Email already registered'});
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name,email,password) VALUES (?,?,?)',[name,email,hash]);
    const user = { id: result.insertId, name, email };
    const token = signToken(user);
    res.json({user, token});
  } catch(err) { console.error(err); res.status(500).json({error:'Server error'}) }
});

router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    if(!email||!password) return res.status(400).json({error:'Missing fields'});
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?',[email]);
    if(!rows.length) return res.status(400).json({error:'Invalid credentials'});
    const user = rows[0];
    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json({error:'Invalid credentials'});
    const token = signToken(user);
    res.json({user: {id:user.id,name:user.name,email:user.email}, token});
  }catch(err){console.error(err); res.status(500).json({error:'Server error'})}
});

module.exports = router;
