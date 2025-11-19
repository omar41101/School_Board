const Student = require('../models/Student.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllStudents = asyncHandler(async (req, res) => {
  const { level, className, status, page = 1, limit = 10 } = req.query;
  const query = {};
  if (level) query.level = level;
  if (className) query.className = className;
  if (status) query.status = status;

  const students = await Student.find(query)
    .populate('user', 'name email avatar phone')
    .populate('parent')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Student.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: students.length,
    totalPages: Math.ceil(count / limit),
    data: { students }
  });
});

exports.getStudentById = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate('user', 'name email avatar phone')
    .populate('parent');

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

exports.createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { student }
  });
});

exports.updateStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Student deleted successfully'
  });
});
