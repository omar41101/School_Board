const Teacher = require('../models/Teacher.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find().populate('user', 'name email avatar phone');
  res.status(200).json({ status: 'success', results: teachers.length, data: { teachers } });
});

exports.getTeacherById = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id).populate('user');
  if (!teacher) return next(new AppError('Teacher not found', 404));
  res.status(200).json({ status: 'success', data: { teacher } });
});

exports.createTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.status(201).json({ status: 'success', data: { teacher } });
});

exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const { _id, createdAt, updatedAt, ...updateData } = req.body;
  
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!teacher) return next(new AppError('Teacher not found', 404));
  res.status(200).json({ status: 'success', data: { teacher } });
});

exports.deleteTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) return next(new AppError('Teacher not found', 404));
  res.status(200).json({ status: 'success', message: 'Teacher deleted' });
});
