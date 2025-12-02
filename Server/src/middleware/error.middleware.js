const { AppError } = require('../utils/errorHandler');

/**
 * Enhanced Error Logger
 * Logs errors with context, severity, and timestamps
 */
const logError = (err, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user ? req.user.id : 'unauthenticated',
    error: {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    }
  };

  // Color-coded console logging
  if (process.env.NODE_ENV === 'development') {
    console.error('\n🔴 ERROR OCCURRED:');
    console.error('─'.repeat(50));
    console.error(`📍 URL: ${errorLog.method} ${errorLog.url}`);
    console.error(`👤 User: ${errorLog.user}`);
    console.error(`⚠️  Type: ${err.name}`);
    console.error(`💬 Message: ${err.message}`);
    if (err.details) console.error(`📝 Details:`, err.details);
    console.error(`📊 Status: ${err.statusCode || 500}`);
    if (err.stack) console.error(`🔍 Stack:\n${err.stack}`);
    console.error('─'.repeat(50) + '\n');
  } else {
    // Production: log to file/service (implement later)
    console.error(JSON.stringify(errorLog));
  }
};

/**
 * Handle Mongoose CastError (Invalid ObjectId)
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose Duplicate Key Error
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;
  return new AppError(message, 409, { field, value });
};

/**
 * Handle Mongoose Validation Error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message,
    value: el.value
  }));
  const message = `Invalid input data. ${errors.length} error(s) found.`;
  return new AppError(message, 400, { errors });
};

/**
 * Handle JWT Invalid Token
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

/**
 * Handle JWT Expired Token
 */
const handleJWTExpiredError = () => {
  return new AppError('Your session has expired. Please log in again.', 401);
};

/**
 * Send Error Response in Development
 */
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    details: err.details,
    stack: err.stack,
    timestamp: err.timestamp || new Date().toISOString()
  });
};

/**
 * Send Error Response in Production
 */
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.details && { details: err.details }),
      timestamp: err.timestamp || new Date().toISOString()
    });
  } 
  // Programming or unknown error: don't leak error details
  else {
    console.error('💥 NON-OPERATIONAL ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logError(err, req);

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Handle specific error types
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Send response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = { 
  errorHandler, 
  notFoundHandler,
  logError 
};
