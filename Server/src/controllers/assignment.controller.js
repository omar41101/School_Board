const Assignment = require('../models/Assignment.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find().populate('course teacher', 'name code');
  res.status(200).json({ status: 'success', results: assignments.length, data: { assignments } });
});

exports.getAssignmentById = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id).populate('course teacher submissions.student');
  if (!assignment) return next(new AppError('Assignment not found', 404));
  res.status(200).json({ status: 'success', data: { assignment } });
});

exports.createAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.create(req.body);
  res.status(201).json({ status: 'success', data: { assignment } });
});

exports.updateAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!assignment) return next(new AppError('Assignment not found', 404));
  res.status(200).json({ status: 'success', data: { assignment } });
});

exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);
  if (!assignment) return next(new AppError('Assignment not found', 404));
  res.status(200).json({ status: 'success', message: 'Assignment deleted' });
});

exports.submitAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return next(new AppError('Assignment not found', 404));
  
  assignment.submissions.push(req.body);
  await assignment.save();
  res.status(200).json({ status: 'success', data: { assignment } });
});
