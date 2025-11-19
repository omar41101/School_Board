const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    enum: ['tuition', 'transport', 'library', 'sports', 'exam', 'hostel', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled', 'refunded'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank-transfer', 'cheque', 'online'],
  },
  transactionId: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ['1', '2', 'Summer']
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  invoiceUrl: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate receipt number on payment
paymentSchema.pre('save', function(next) {
  if (this.status === 'paid' && !this.receiptNumber) {
    const timestamp = Date.now();
    this.receiptNumber = `RCP-${timestamp}`;
  }
  next();
});

// Virtual for checking if payment is overdue
paymentSchema.virtual('isOverdue').get(function() {
  return this.status === 'pending' && new Date() > this.dueDate;
});

// Index for faster queries
paymentSchema.index({ student: 1, status: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ academicYear: 1, semester: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
