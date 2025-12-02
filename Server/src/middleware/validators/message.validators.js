const { body, param } = require('express-validator');

exports.createMessageValidation = [
  body('recipient').notEmpty().isMongoId(),
  body('subject').notEmpty().trim().isLength({ min: 1, max: 200 }),
  body('content').notEmpty().trim().isLength({ min: 1, max: 5000 }),
  body('priority').optional().isIn(['low', 'normal', 'high'])
];

exports.updateMessageValidation = [
  param('id').isMongoId(),
  body('isRead').optional().isBoolean()
];

exports.messageIdValidation = [
  param('id').isMongoId().withMessage('Invalid message ID')
];
