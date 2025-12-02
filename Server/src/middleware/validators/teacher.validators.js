const { body, param } = require('express-validator');

exports.createTeacherValidation = [
  body('user').notEmpty().isMongoId().withMessage('Invalid user ID'),
  body('employeeId').notEmpty().trim().isLength({ min: 3, max: 20 }),
  body('dateOfBirth').notEmpty().isISO8601().toDate(),
  body('gender').notEmpty().isIn(['male', 'female', 'other']),
  body('qualification').notEmpty().trim().isLength({ min: 2, max: 200 }),
  body('specialization').optional().trim().isLength({ max: 200 }),
  body('salary').optional().isFloat({ min: 0 }),
  body('experience').optional().isInt({ min: 0 }),
  body('joiningDate').optional().isISO8601().toDate(),
  body('subjects').optional().isArray(),
  body('subjects.*').optional().trim().isLength({ max: 100 })
];

exports.updateTeacherValidation = [
  param('id').isMongoId(),
  body('employeeId').optional().trim().isLength({ min: 3, max: 20 }),
  body('qualification').optional().trim().isLength({ min: 2, max: 200 }),
  body('specialization').optional().trim().isLength({ max: 200 }),
  body('salary').optional().isFloat({ min: 0 }),
  body('experience').optional().isInt({ min: 0 }),
  body('subjects').optional().isArray(),
  body('status').optional().isIn(['active', 'inactive', 'on_leave'])
];

exports.teacherIdValidation = [
  param('id').isMongoId().withMessage('Invalid teacher ID')
];
