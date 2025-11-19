const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Level is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  credits: {
    type: Number,
    default: 1
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    room: String
  }],
  syllabus: [{
    topic: String,
    description: String,
    duration: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ['1', '2', 'Summer'],
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Index for faster queries
courseSchema.index({ code: 1 });
courseSchema.index({ level: 1, subject: 1 });
courseSchema.index({ status: 1 });

module.exports = mongoose.model('Course', courseSchema);
