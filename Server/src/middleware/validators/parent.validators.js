const { body, param } = require('express-validator');

exports.createParentValidation = [
  body('user').notEmpty().isMongoId().withMessage('Invalid user ID'),
  body('relationship').notEmpty().isIn(['father', 'mother', 'guardian']),
  body('children').optional().isArray(),
  body('children.*').optional().isMongoId().withMessage('Invalid child ID'),
  body('occupation').optional().trim().isLength({ max: 100 })
];

exports.updateParentValidation = [
  param('id').isMongoId(),
  body('relationship').optional().isIn(['father', 'mother', 'guardian']),
  body('children').optional().isArray(),
  body('children.*').optional().isMongoId(),
  body('occupation').optional().trim().isLength({ max: 100 })
];

exports.parentIdValidation = [
  param('id').isMongoId().withMessage('Invalid parent ID')
];
