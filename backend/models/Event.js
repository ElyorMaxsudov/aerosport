const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['marathon', 'cycling'],
  },
  category: {
    type: String,
    required: true,
    default: 'Marathon',
  },
  date: {
    type: String,
    required: [true, 'Event date is required'],
  },
  time: {
    type: String,
    default: '07:30 AM',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  distance: {
    type: String,
    required: [true, 'Distance is required (e.g. 42.2 km, 21 km, 80 km)'],
  },
  elevationGain: {
    type: String,
    default: '150m',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
    default: 'Intermediate',
  },
  maxParticipants: {
    type: Number,
    default: 1000,
  },
  participantsCount: {
    type: Number,
    default: 0,
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  entryFee: {
    type: Number,
    default: 0,
  },
  prizePool: {
    type: String,
    default: 'Medals & Certificates',
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    default: 'National Athletics Club',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Registration Open', 'Full', 'Completed'],
    default: 'Registration Open',
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
