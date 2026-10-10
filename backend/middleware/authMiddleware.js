const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { usersById } = require('../utils/fallbackStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_sportshub_jwt_key_2026_fitness_pro');
      
      let user = null;
      if (mongoose.connection.readyState === 1 && !String(decoded.id).startsWith('mem_') && !String(decoded.id).startsWith('seed_')) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          user = null;
        }
      }

      // Check fallback store if not found in MongoDB
      if (!user) {
        user = usersById.get(String(decoded.id));
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found for this token' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const sellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'seller' || req.user.isSeller)) {
    next();
  } else {
    res.status(403).json({ message: 'Sotuvchi yoki admin huquqi talab qilinadi / Seller or Admin authorization required' });
  }
};

module.exports = { protect, admin, sellerOrAdmin };
