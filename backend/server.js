
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const internRoutes = require('./routes/Intern');
const taskRoutes = require('./routes/Task');
const attendanceRoutes = require('./routes/Attendance');
const evaluationRoutes = require('./routes/Evaluation');
const userRoutes = require('./routes/User');


const path = require('path');

// serve frontend build (example)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/interns', internRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/users', userRoutes);

// Basic health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
