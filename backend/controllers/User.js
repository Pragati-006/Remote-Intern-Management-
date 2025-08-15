const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'manager' } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role });
    return res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id),
    });
  } catch (e) { return res.status(400).json({ message: e.message }); }
};

// POST /api/users/login
exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id),
      });
    }
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (e) { return res.status(500).json({ message: e.message }); }
};

// GET /api/users/me
exports.getMe = async (req, res) => res.json(req.user);
