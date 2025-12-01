const Attendance = require('../models/Attendance.model');
const { AppError } = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllAttendance = asyncHandler(async (req, res) => {
  const { student, date, status } = req.query;
  const query = {};
  if (student) query.student = student;
  if (date) query.date = new Date(date);
  if (status) query.status = status;

  const attendance = await Attendance.find(query).populate('student course teacher', 'name matricule code');
  res.status(200).json({ status: 'success', results: attendance.length, data: { attendance } });
});

exports.createAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.create(req.body);
  res.status(201).json({ status: 'success', data: { attendance } });
});

exports.updateAttendance = asyncHandler(async (req, res, next) => {
  const { _id, createdAt, updatedAt, ...updateData } = req.body;
  
  const attendance = await Attendance.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!attendance) return next(new AppError('Attendance record not found', 404));
  res.status(200).json({ status: 'success', data: { attendance } });
});

exports.deleteAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findByIdAndDelete(req.params.id);
  if (!attendance) return next(new AppError('Attendance record not found', 404));
  res.status(200).json({ status: 'success', message: 'Attendance deleted' });
});
