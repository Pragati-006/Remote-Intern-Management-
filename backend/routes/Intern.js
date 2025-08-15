const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createIntern,
  getInterns,
  updateIntern,
  deleteIntern
} = require('../controllers/Intern');

router.route('/')
  .post(protect, createIntern)
  .get(protect, getInterns);

router.route('/:id')
  .put(protect, updateIntern)
  .delete(protect, deleteIntern);

module.exports = router;
