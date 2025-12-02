const { body, param } = require('express-validator');

exports.createAssignmentValidation = [
  body('title').notEmpty().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('course').notEmpty().isMongoId(),
  body('teacher').notEmpty().isMongoId(),
  body('subject').notEmpty().trim(),
  body('level').notEmpty().trim(),
  body('className').notEmpty().trim(),
  body('dueDate').notEmpty().isISO8601().toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  body('totalMarks').optional().isFloat({ min: 1 })
];

exports.updateAssignmentValidation = [
  param('id').isMongoId(),
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('dueDate').optional().isISO8601().toDate(),
  body('totalMarks').optional().isFloat({ min: 1 })
];

exports.assignmentIdValidation = [
  param('id').isMongoId().withMessage('Invalid assignment ID')
];
