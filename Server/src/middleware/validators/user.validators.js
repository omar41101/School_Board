const { body, param } = require('express-validator');

/**
 * Update User Validation
 */
exports.updateUserValidation = [
  param('id')
    .isMongoId().withMessage('Invalid user ID'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens and apostrophes'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters, spaces, hyphens and apostrophes'),

  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s+()-]+$/).withMessage('Invalid phone number format'),

  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL'),

  body('role')
    .optional()
    .isIn(['admin', 'student', 'teacher', 'parent', 'direction'])
    .withMessage('Invalid role'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
];

/**
 * Update Own Profile Validation
 */
exports.updateOwnProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters'),

  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s+()-]+$/).withMessage('Invalid phone number format'),

  body('avatar')
    .optional()
    .isURL().withMessage('Avatar must be a valid URL')
];

/**
 * ID Param Validation
 */
exports.userIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID')
];
