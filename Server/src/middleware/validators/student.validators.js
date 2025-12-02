const { body, param } = require('express-validator');

/**
 * Create Student Validation
 */
exports.createStudentValidation = [
  body('user')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID'),

  body('matricule')
    .notEmpty().withMessage('Matricule is required')
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Matricule must be between 3-20 characters'),

  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Invalid date format')
    .toDate()
    .custom((value) => {
      const age = Math.floor((new Date() - new Date(value)) / 31557600000);
      if (age < 3 || age > 25) {
        throw new Error('Student age must be between 3 and 25 years');
      }
      return true;
    }),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),

  body('level')
    .notEmpty().withMessage('Level is required')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Level must be between 1-50 characters'),

  body('className')
    .notEmpty().withMessage('Class name is required')
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Class name must be between 1-50 characters'),

  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Street address too long'),

  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City name too long'),

  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('State name too long'),

  body('address.zipCode')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9\s-]+$/).withMessage('Invalid zip code format'),

  body('address.country')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country name too long'),

  body('parent')
    .optional()
    .isMongoId().withMessage('Invalid parent ID'),

  body('emergencyContact.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Emergency contact name must be between 2-100 characters'),

  body('emergencyContact.phone')
    .optional()
    .trim()
    .matches(/^[\d\s+()-]+$/).withMessage('Invalid phone number format'),

  body('emergencyContact.relationship')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Relationship too long'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended', 'graduated'])
    .withMessage('Invalid status')
];

/**
 * Update Student Validation
 */
exports.updateStudentValidation = [
  param('id')
    .isMongoId().withMessage('Invalid student ID'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters'),

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

  body('matricule')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Matricule must be between 3-20 characters'),

  body('dateOfBirth')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .toDate(),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),

  body('level')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Level must be between 1-50 characters'),

  body('className')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Class name must be between 1-50 characters'),

  body('parent')
    .optional()
    .isMongoId().withMessage('Invalid parent ID'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended', 'graduated'])
    .withMessage('Invalid status')
];

/**
 * ID Param Validation
 */
exports.studentIdValidation = [
  param('id').isMongoId().withMessage('Invalid student ID')
];
