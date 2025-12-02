const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { AuthenticationError, AuthorizationError } = require('../utils/errorHandler');

// Protect routes - verify JWT token or API key
exports.protect = async (req, res, next) => {
  try {
    // Skip JWT auth if API key was already validated
    if (req.skipJwtAuth && req.isApiKeyAuth) {
      return next();
    }

    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AuthenticationError('Not authorized to access this route. Please provide a valid JWT token or API key'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new AuthenticationError('User no longer exists'));
      }

      if (!req.user.isActive) {
        return next(new AuthenticationError('Your account has been deactivated'));
      }

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(new AuthenticationError('Invalid token'));
      }
      if (error.name === 'TokenExpiredError') {
        return next(new AuthenticationError('Token expired'));
      }
      return next(new AuthenticationError('Not authorized to access this route'));
    }
  } catch (error) {
    next(error);
  }
};

// Restrict to specific roles (only works with JWT auth, not API keys)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // If using API key auth, check role from pseudo user object
    if (req.isApiKeyAuth && req.user) {
      if (!roles.includes(req.user.role)) {
        return next(
          new AuthorizationError(`API key with role '${req.user.role}' is not authorized to access this route`)
        );
      }
      return next();
    }

    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError(`User role '${req.user.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};

// Generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};
