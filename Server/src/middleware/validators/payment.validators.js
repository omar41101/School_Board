const { body, param } = require('express-validator');

exports.createPaymentValidation = [
  body('student').notEmpty().isMongoId(),
  body('type').notEmpty().isIn(['tuition', 'library', 'sports', 'canteen', 'transport', 'other']),
  body('amount').notEmpty().isFloat({ min: 0.01 }),
  body('dueDate').notEmpty().isISO8601().toDate(),
  body('academicYear').notEmpty().matches(/^\d{4}-\d{4}$/),
  body('description').optional().trim().isLength({ max: 500 }),
  body('status').optional().isIn(['pending', 'paid', 'overdue', 'cancelled'])
];

exports.updatePaymentValidation = [
  param('id').isMongoId(),
  body('amount').optional().isFloat({ min: 0.01 }),
  body('status').optional().isIn(['pending', 'paid', 'overdue', 'cancelled']),
  body('paidDate').optional().isISO8601().toDate(),
  body('description').optional().trim().isLength({ max: 500 })
];

exports.paymentIdValidation = [
  param('id').isMongoId().withMessage('Invalid payment ID')
];
