const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  criteria: { type: String, required: true },
  score: { type: Number, required: true },
  comments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
