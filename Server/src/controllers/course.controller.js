const Course = require('../models/Course.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllCourses = asyncHandler(async (req, res) => {
  const { level, subject, status } = req.query;
  const query = {};
  if (level) query.level = level;
  if (subject) query.subject = subject;
  if (status) query.status = status;

  const courses = await Course.find(query).populate('teacher', 'name email').populate('enrolledStudents', 'name matricule');
  res.status(200).json({ status: 'success', results: courses.length, data: { courses } });
});

exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('teacher').populate('enrolledStudents');
  if (!course) return next(new AppError('Course not found', 404));
  res.status(200).json({ status: 'success', data: { course } });
});

exports.createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json({ status: 'success', data: { course } });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!course) return next(new AppError('Course not found', 404));
  res.status(200).json({ status: 'success', data: { course } });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  res.status(200).json({ status: 'success', message: 'Course deleted' });
});

exports.enrollStudent = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  
  if (course.enrolledStudents.includes(req.body.studentId)) {
    return next(new AppError('Student already enrolled', 400));
  }
  
  course.enrolledStudents.push(req.body.studentId);
  await course.save();
  
  res.status(200).json({ status: 'success', data: { course } });
});
