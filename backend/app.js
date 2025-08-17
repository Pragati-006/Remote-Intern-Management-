// backend/app.js
const express = require('express');
const cors = require('cors');

const internRoutes = require('./routes/Intern');
const taskRoutes = require('./routes/Task');
const attendanceRoutes = require('./routes/Attendance');
const evaluationRoutes = require('./routes/Evaluation');
const userRoutes = require('./routes/User');

const app = express();
app.use(cors());
app.use(express.json());

// Health for tests/monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Server is running' });
});

// API routes
app.use('/api/interns', internRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
