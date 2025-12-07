const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
require('events').EventEmitter.defaultMaxListeners = 20;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/consultations', require('./src/routes/consultation'));
app.use('/api/goals', require('./src/routes/goals'));
app.use('/api/users', require('./src/routes/user'));

// Root route
app.get('/', (req, res) => res.send('✅ Backend is running!'));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
