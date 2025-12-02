const { body, param } = require('express-validator');

exports.createGradeValidation = [
  body('student').notEmpty().isMongoId(),
  body('course').notEmpty().isMongoId(),
  body('teacher').notEmpty().isMongoId(),
  body('examType').notEmpty().isIn(['quiz', 'midterm', 'final', 'assignment', 'project', 'practical']),
  body('subject').notEmpty().trim().isLength({ max: 100 }),
  body('marks').notEmpty().isFloat({ min: 0 }),
  body('totalMarks').notEmpty().isFloat({ min: 1 }),
  body('academicYear').notEmpty().matches(/^\d{4}-\d{4}$/),
  body('semester').notEmpty().isIn(['1', '2', '3']),
  body('examDate').optional().isISO8601().toDate(),
  body('remarks').optional().trim().isLength({ max: 500 })
];

exports.updateGradeValidation = [
  param('id').isMongoId(),
  body('marks').optional().isFloat({ min: 0 }),
  body('totalMarks').optional().isFloat({ min: 1 }),
  body('remarks').optional().trim().isLength({ max: 500 })
];

exports.gradeIdValidation = [
  param('id').isMongoId().withMessage('Invalid grade ID')
];
