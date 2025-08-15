const Evaluation = require('../models/Evaluation');
const Task = require('../models/Task');
const Attendance = require('../models/Attendance');

// Submit evaluation
exports.submitEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json(evaluation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get performance report
exports.getPerformanceReport = async (req, res) => {
  try {
    const { internId } = req.query;
    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    // Calculate task completion %
    const tasks = await Task.find({ intern: internId });
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const taskCompletionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Calculate attendance %
    const attendanceRecords = await Attendance.find({ intern: internId });
    const presentDays = attendanceRecords.filter(r => r.status === 'Present').length;
    const attendancePercentage = attendanceRecords.length > 0 ? (presentDays / attendanceRecords.length) * 100 : 0;

    // Get evaluation scores
    const evaluations = await Evaluation.find({ intern: internId });
    const avgEvaluationScore = evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
      : 0;

    // Final score formula
    const finalScore = (taskCompletionPercentage * 0.4) +
                       (attendancePercentage * 0.3) +
                       (avgEvaluationScore * 10 * 0.3);

    res.json({
      taskCompletionPercentage: taskCompletionPercentage.toFixed(2),
      attendancePercentage: attendancePercentage.toFixed(2),
      avgEvaluationScore: avgEvaluationScore.toFixed(2),
      finalScore: finalScore.toFixed(2),
      evaluations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete evaluation
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByIdAndDelete(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ message: 'Evaluation removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
