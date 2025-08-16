
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const internRoutes = require('./routes/Intern');
const taskRoutes = require('./routes/Task');
const attendanceRoutes = require('./routes/Attendance');
const evaluationRoutes = require('./routes/Evaluation');
let userRoutes; try { userRoutes = require('./routes/User'); } catch { userRoutes = null; }

const app = express();
app.use(cors());
app.use(express.json());

// Health check (useful for PM2/ELB checks)
app.get('/api/health', (_req, res) => res.status(200).json({ ok: true, message: 'Server is running' }));

// API routes
if (userRoutes) app.use('/api/users', userRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Serve frontend (only if you want Node to serve it; for Nginx you can skip this)
if (process.env.NODE_ENV === 'production') {
  // Prefer serving the React *build* folder
  const buildPath = path.join(__dirname, '../frontend/public');
  app.use(express.static(buildPath));

  // SPA fallback — keep this AFTER API routes so it doesn’t swallow them
  app.get('*', (_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

// Connect DB then start server
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();