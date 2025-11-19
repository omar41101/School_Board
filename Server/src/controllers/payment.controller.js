const Payment = require('../models/Payment.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllPayments = asyncHandler(async (req, res) => {
  const { student, status, type } = req.query;
  const query = {};
  if (student) query.student = student;
  if (status) query.status = status;
  if (type) query.type = type;

  const payments = await Payment.find(query).populate('student', 'name matricule');
  res.status(200).json({ status: 'success', results: payments.length, data: { payments } });
});

exports.getPaymentById = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('student');
  if (!payment) return next(new AppError('Payment not found', 404));
  res.status(200).json({ status: 'success', data: { payment } });
});

exports.createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create(req.body);
  res.status(201).json({ status: 'success', data: { payment } });
});

exports.updatePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!payment) return next(new AppError('Payment not found', 404));
  res.status(200).json({ status: 'success', data: { payment } });
});

exports.markAsPaid = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'paid', paidDate: new Date() }, { new: true });
  if (!payment) return next(new AppError('Payment not found', 404));
  res.status(200).json({ status: 'success', data: { payment } });
});
