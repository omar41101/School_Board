const Event = require('../models/Event.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllEvents = asyncHandler(async (req, res) => {
  const { type, status, startDate, endDate } = req.query;
  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (startDate) query.startDate = { $gte: new Date(startDate) };
  if (endDate) query.endDate = { $lte: new Date(endDate) };

  const events = await Event.find(query).populate('organizer participants', 'name email role');
  res.status(200).json({ status: 'success', results: events.length, data: { events } });
});

exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('organizer participants');
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', data: { event } });
});

exports.createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, organizer: req.user.id });
  res.status(201).json({ status: 'success', data: { event } });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', data: { event } });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));
  res.status(200).json({ status: 'success', message: 'Event deleted' });
});

exports.joinEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new AppError('Event not found', 404));
  
  if (event.participants.includes(req.user.id)) {
    return next(new AppError('Already joined this event', 400));
  }
  
  event.participants.push(req.user.id);
  await event.save();
  res.status(200).json({ status: 'success', data: { event } });
});
