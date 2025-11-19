const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'holiday', 'exam', 'meeting', 'other'],
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: String,
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'staff'],
    default: 'all'
  },
  levels: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  attachments: [{
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  maxParticipants: {
    type: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for participant count
eventSchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Index for faster queries
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
