const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  examType: {
    type: String,
    enum: ['quiz', 'midterm', 'final', 'assignment', 'project', 'practical'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: 0
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks are required'],
    min: 1
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
  },
  remarks: {
    type: String,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ['1', '2', 'Summer'],
    required: true
  },
  examDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate percentage and grade before saving
gradeSchema.pre('save', function(next) {
  // Calculate percentage
  this.percentage = (this.marks / this.totalMarks) * 100;
  
  // Assign grade based on percentage
  if (this.percentage >= 90) this.grade = 'A+';
  else if (this.percentage >= 85) this.grade = 'A';
  else if (this.percentage >= 80) this.grade = 'B+';
  else if (this.percentage >= 70) this.grade = 'B';
  else if (this.percentage >= 65) this.grade = 'C+';
  else if (this.percentage >= 60) this.grade = 'C';
  else if (this.percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

// Index for faster queries
gradeSchema.index({ student: 1, course: 1 });
gradeSchema.index({ academicYear: 1, semester: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
