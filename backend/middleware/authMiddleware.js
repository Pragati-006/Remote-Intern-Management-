// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // <-- make sure this file exists

/**
 * Protect middleware
 * Checks Authorization: Bearer <token>, verifies JWT, loads user (without password) into req.user
 */
const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const isBearer = auth.startsWith('Bearer ');

    if (!isBearer) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = auth.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }

    // Attach user (sans password) to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    // Token errors commonly thrown by jwt.verify: TokenExpiredError, JsonWebTokenError
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Optional: role-based guard
 * Usage: router.get('/admin-only', protect, authorize('admin'), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: 'Forbidden: insufficient rights' });
    }
    next();
  };
};

module.exports = { protect, authorize };
