const { body, param } = require('express-validator');

exports.createEventValidation = [
  body('title').notEmpty().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('type').notEmpty().isIn(['academic', 'sports', 'cultural', 'meeting', 'holiday', 'other']),
  body('startDate').notEmpty().isISO8601().toDate(),
  body('endDate').notEmpty().isISO8601().toDate()
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('location').optional().trim().isLength({ max: 200 }),
  body('organizer').notEmpty().isMongoId(),
  body('participants').optional().isArray(),
  body('participants.*').optional().isMongoId()
];

exports.updateEventValidation = [
  param('id').isMongoId(),
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('type').optional().isIn(['academic', 'sports', 'cultural', 'meeting', 'holiday', 'other']),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
  body('location').optional().trim().isLength({ max: 200 }),
  body('participants').optional().isArray()
];

exports.eventIdValidation = [
  param('id').isMongoId().withMessage('Invalid event ID')
];
