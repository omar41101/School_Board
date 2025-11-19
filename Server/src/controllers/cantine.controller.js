const Cantine = require('../models/Cantine.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllOrders = asyncHandler(async (req, res) => {
  const { student, date, status, mealType } = req.query;
  const query = {};
  if (student) query.student = student;
  if (date) query.date = new Date(date);
  if (status) query.status = status;
  if (mealType) query.mealType = mealType;

  const orders = await Cantine.find(query).populate('student', 'name matricule');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Cantine.findById(req.params.id).populate('student');
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await Cantine.create(req.body);
  res.status(201).json({ status: 'success', data: { order } });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Cantine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Cantine.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: { order } });
});
