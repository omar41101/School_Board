const { body, param } = require('express-validator');

exports.createAttendanceValidation = [
  body('student').notEmpty().isMongoId(),
  body('course').notEmpty().isMongoId(),
  body('date').notEmpty().isISO8601().toDate(),
  body('status').notEmpty().isIn(['present', 'absent', 'late', 'excused']),
  body('academicYear').notEmpty().matches(/^\d{4}-\d{4}$/),
  body('semester').notEmpty().isIn(['1', '2', '3']),
  body('remarks').optional().trim().isLength({ max: 500 })
];

exports.updateAttendanceValidation = [
  param('id').isMongoId(),
  body('status').optional().isIn(['present', 'absent', 'late', 'excused']),
  body('remarks').optional().trim().isLength({ max: 500 })
];

exports.attendanceIdValidation = [
  param('id').isMongoId().withMessage('Invalid attendance ID')
];
