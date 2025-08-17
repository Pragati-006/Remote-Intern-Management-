require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const userRoutes = require('../routes/User');
const internRoutes = require('../routes/Intern');
const taskRoutes = require('../routes/Task');
const attendanceRoutes = require('../routes/Attendance');
const evaluationRoutes = require('../routes/Evaluation');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'Server running fine' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/evaluations', evaluationRoutes);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(buildPath));
  app.get('*', (_req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

module.exports = app;
