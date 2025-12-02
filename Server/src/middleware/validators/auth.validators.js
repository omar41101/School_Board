const { body } = require('express-validator');

/**
 * Registration Validation
 */
exports.registerValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name can only contain letters, spaces, hyphens and apostrophes'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name can only contain letters, spaces, hyphens and apostrophes'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 128 }).withMessage('Password must be between 6-128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .optional()
    .isIn(['admin', 'student', 'teacher', 'parent', 'direction'])
    .withMessage('Invalid role. Must be one of: admin, student, teacher, parent, direction'),

  // Student-specific validations
  body('matricule')
    .if(body('role').equals('student'))
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Matricule must be between 3-20 characters'),

  body('dateOfBirth')
    .if(body('role').isIn(['student', 'teacher']))
    .optional()
    .isISO8601().withMessage('Invalid date format for date of birth')
    .toDate()
    .custom((value) => {
      const age = Math.floor((new Date() - new Date(value)) / 31557600000);
      if (age < 3 || age > 120) {
        throw new Error('Age must be between 3 and 120 years');
      }
      return true;
    }),

  body('gender')
    .if(body('role').isIn(['student', 'teacher']))
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),

  body('level')
    .if(body('role').equals('student'))
    .optional()
    .trim()
    .notEmpty().withMessage('Level is required for students'),

  body('className')
    .if(body('role').equals('student'))
    .optional()
    .trim()
    .notEmpty().withMessage('Class name is required for students'),

  // Teacher-specific validations
  body('employeeId')
    .if(body('role').equals('teacher'))
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Employee ID must be between 3-20 characters'),

  body('qualification')
    .if(body('role').equals('teacher'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Qualification must be between 2-100 characters'),

  body('specialization')
    .if(body('role').equals('teacher'))
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Specialization must be between 2-100 characters'),

  body('salary')
    .if(body('role').equals('teacher'))
    .optional()
    .isFloat({ min: 0 }).withMessage('Salary must be a positive number'),

  // Parent-specific validations
  body('relationship')
    .if(body('role').equals('parent'))
    .optional()
    .isIn(['father', 'mother', 'guardian']).withMessage('Relationship must be father, mother, or guardian')
];

/**
 * Login Validation
 */
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Update Password Validation
 */
exports.updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6, max: 128 }).withMessage('New password must be between 6-128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];
