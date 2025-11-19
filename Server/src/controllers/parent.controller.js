const Parent = require('../models/Parent.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllParents = asyncHandler(async (req, res) => {
  const parents = await Parent.find().populate('user', 'name email avatar phone').populate('children');
  res.status(200).json({ status: 'success', results: parents.length, data: { parents } });
});

exports.getParentById = asyncHandler(async (req, res, next) => {
  const parent = await Parent.findById(req.params.id).populate('user').populate('children');
  if (!parent) return next(new AppError('Parent not found', 404));
  res.status(200).json({ status: 'success', data: { parent } });
});

exports.createParent = asyncHandler(async (req, res) => {
  const parent = await Parent.create(req.body);
  res.status(201).json({ status: 'success', data: { parent } });
});

exports.updateParent = asyncHandler(async (req, res, next) => {
  const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!parent) return next(new AppError('Parent not found', 404));
  res.status(200).json({ status: 'success', data: { parent } });
});

exports.deleteParent = asyncHandler(async (req, res, next) => {
  const parent = await Parent.findByIdAndDelete(req.params.id);
  if (!parent) return next(new AppError('Parent not found', 404));
  res.status(200).json({ status: 'success', message: 'Parent deleted' });
});
