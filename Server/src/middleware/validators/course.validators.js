const { body, param } = require('express-validator');

exports.createCourseValidation = [
  body('name').notEmpty().trim().isLength({ min: 3, max: 200 }),
  body('code').notEmpty().trim().isLength({ min: 2, max: 20 }),
  body('level').notEmpty().trim(),
  body('subject').notEmpty().trim().isLength({ max: 100 }),
  body('teacher').notEmpty().isMongoId(),
  body('academicYear').notEmpty().matches(/^\d{4}-\d{4}$/),
  body('semester').notEmpty().isIn(['1', '2', '3']),
  body('maxStudents').optional().isInt({ min: 1, max: 200 }),
  body('enrolledStudents').optional().isArray(),
  body('enrolledStudents.*').optional().isMongoId()
];

exports.updateCourseValidation = [
  param('id').isMongoId(),
  body('name').optional().trim().isLength({ min: 3, max: 200 }),
  body('code').optional().trim().isLength({ min: 2, max: 20 }),
  body('subject').optional().trim().isLength({ max: 100 }),
  body('teacher').optional().isMongoId(),
  body('maxStudents').optional().isInt({ min: 1, max: 200 }),
  body('enrolledStudents').optional().isArray()
];

exports.courseIdValidation = [
  param('id').isMongoId().withMessage('Invalid course ID')
];
