const Intern = require('../models/Intern');

// Create
exports.createIntern = async (req, res) => {
  try {
    const intern = await Intern.create(req.body);
    res.status(201).json(intern);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Read All
exports.getInterns = async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateIntern = async (req, res) => {
  try {
    const intern = await Intern.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(intern);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteIntern = async (req, res) => {
  try {
    await Intern.findByIdAndDelete(req.params.id);
    res.json({ message: 'Intern removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
