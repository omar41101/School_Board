const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errorHandler');

/**
 * Enhanced Validation Middleware
 * Handles express-validator errors and formats them consistently
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    // Use new ValidationError class with details
    return next(new ValidationError(
      `Validation failed for ${formattedErrors.length} field(s)`,
      formattedErrors
    ));
  }
  
  next();
};
