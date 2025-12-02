/**
 * Central Validation Export
 * Exports all validation rules for different routes
 */

const authValidators = require('./auth.validators');
const userValidators = require('./user.validators');
const studentValidators = require('./student.validators');
const teacherValidators = require('./teacher.validators');
const parentValidators = require('./parent.validators');
const courseValidators = require('./course.validators');
const gradeValidators = require('./grade.validators');
const assignmentValidators = require('./assignment.validators');
const attendanceValidators = require('./attendance.validators');
const paymentValidators = require('./payment.validators');
const messageValidators = require('./message.validators');
const eventValidators = require('./event.validators');
const cantineValidators = require('./cantine.validators');

module.exports = {
  authValidators,
  userValidators,
  studentValidators,
  teacherValidators,
  parentValidators,
  courseValidators,
  gradeValidators,
  assignmentValidators,
  attendanceValidators,
  paymentValidators,
  messageValidators,
  eventValidators,
  cantineValidators
};
