const Message = require('../models/Message.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
    .populate('sender recipient', 'name email avatar role')
    .sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', results: messages.length, data: { messages } });
});

exports.getMessageById = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate('sender recipient');
  if (!message) return next(new AppError('Message not found', 404));
  res.status(200).json({ status: 'success', data: { message } });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const message = await Message.create({ ...req.body, sender: req.user.id });
  res.status(201).json({ status: 'success', data: { message } });
});

exports.markAsRead = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() }, { new: true });
  if (!message) return next(new AppError('Message not found', 404));
  res.status(200).json({ status: 'success', data: { message } });
});

exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) return next(new AppError('Message not found', 404));
  res.status(200).json({ status: 'success', message: 'Message deleted' });
});
