const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  markAttendance,
  getAttendanceReport,
  deleteAttendance
} = require('../controllers/Attendance');

router.route('/')
  .post(protect, markAttendance)      // Mark attendance

router.route('/report')
  .get(protect, getAttendanceReport); // Get attendance report

router.route('/:id')
  .delete(protect, deleteAttendance); // Delete attendance record

module.exports = router;
