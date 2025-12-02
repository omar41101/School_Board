const { body, param } = require('express-validator');

exports.createCantineValidation = [
  body('student').notEmpty().isMongoId(),
  body('date').notEmpty().isISO8601().toDate(),
  body('mealType').notEmpty().isIn(['breakfast', 'lunch', 'snack', 'dinner']),
  body('items').notEmpty().isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').notEmpty().trim().isLength({ max: 100 }),
  body('items.*.category').notEmpty().isIn(['main', 'side', 'drink', 'dessert', 'snack']),
  body('items.*.quantity').notEmpty().isInt({ min: 1, max: 99 }),
  body('items.*.price').notEmpty().isFloat({ min: 0.01 }),
  body('status').optional().isIn(['pending', 'confirmed', 'delivered', 'cancelled']),
  body('paymentStatus').optional().isIn(['pending', 'paid', 'refunded'])
];

exports.updateCantineValidation = [
  param('id').isMongoId(),
  body('status').optional().isIn(['pending', 'confirmed', 'delivered', 'cancelled']),
  body('paymentStatus').optional().isIn(['pending', 'paid', 'refunded']),
  body('items').optional().isArray(),
  body('specialInstructions').optional().trim().isLength({ max: 500 })
];

exports.cantineIdValidation = [
  param('id').isMongoId().withMessage('Invalid cantine order ID')
];
