const Grade = require('../models/Grade.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllGrades = asyncHandler(async (req, res) => {
  const { student, course, academicYear, semester } = req.query;
  const query = {};
  if (student) query.student = student;
  if (course) query.course = course;
  if (academicYear) query.academicYear = academicYear;
  if (semester) query.semester = semester;

  const grades = await Grade.find(query).populate('student course teacher', 'name matricule code');
  res.status(200).json({ status: 'success', results: grades.length, data: { grades } });
});

exports.getGradeById = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findById(req.params.id).populate('student course teacher');
  if (!grade) return next(new AppError('Grade not found', 404));
  res.status(200).json({ status: 'success', data: { grade } });
});

exports.createGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.create(req.body);
  res.status(201).json({ status: 'success', data: { grade } });
});

exports.updateGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!grade) return next(new AppError('Grade not found', 404));
  res.status(200).json({ status: 'success', data: { grade } });
});

exports.deleteGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findByIdAndDelete(req.params.id);
  if (!grade) return next(new AppError('Grade not found', 404));
  res.status(200).json({ status: 'success', message: 'Grade deleted' });
});
