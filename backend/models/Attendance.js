const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
