
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const internRoutes = require('./routes/Intern');
const taskRoutes = require('./routes/Task');
const attendanceRoutes = require('./routes/Attendance');
const evaluationRoutes = require('./routes/Evaluation');
const userRoutes = require('./routes/User');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Health check (useful for PM2/ELB checks)
app.get('/api/health', (_req, res) => res.status(200).json({ ok: true, message: 'Server is running' }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/evaluations', evaluationRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));