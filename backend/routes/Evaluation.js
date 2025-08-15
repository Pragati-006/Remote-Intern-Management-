const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  submitEvaluation,
  getPerformanceReport,
  deleteEvaluation
} = require('../controllers/Evaluation');

router.route('/')
  .post(protect, submitEvaluation);   // Submit evaluation

router.route('/report')
  .get(protect, getPerformanceReport); // Get performance report

router.route('/:id')
  .delete(protect, deleteEvaluation); // Delete evaluation

module.exports = router;
 