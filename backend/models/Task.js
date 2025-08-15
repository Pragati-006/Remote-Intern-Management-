/*
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    deadline: { type: Date },
});

module.exports = mongoose.model('Task', taskSchema);*/

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  intern: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
