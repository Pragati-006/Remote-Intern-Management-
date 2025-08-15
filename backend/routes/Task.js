const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/Task');

router.route('/')
  .post(protect, createTask)    // Create new task
  .get(protect, getTasks);      // Get tasks (optionally filter by internId)

router.route('/:id')
  .put(protect, updateTask)     // Update task details or status
  .delete(protect, deleteTask); // Delete task

module.exports = router;
