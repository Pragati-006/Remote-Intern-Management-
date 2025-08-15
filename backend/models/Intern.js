const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  startDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Intern', internSchema);
