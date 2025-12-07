const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const consultRoutes = require('./src/routes/consultation');
const goalsRoutes = require('./src/routes/goals');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());


app.get('/', (req, res) => {
  res.json({ status: '✅ Dietician API running successfully' });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/consult', consultRoutes);
app.use('/api/goals', goalsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
