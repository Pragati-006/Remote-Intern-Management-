const Attendance = require('../models/Attendance');

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { intern, date } = req.body;

    // Prevent duplicate entry for same date & intern
    const exists = await Attendance.findOne({ intern, date });
    if (exists) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get attendance report
exports.getAttendanceReport = async (req, res) => {
  try {
    const { internId } = req.query;
    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const records = await Attendance.find({ intern: internId }).sort({ date: -1 });

    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === 'Present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.json({ records, attendancePercentage: attendancePercentage.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });
    res.json({ message: 'Attendance removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
