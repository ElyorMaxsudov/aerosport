const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  sports: {
    type: [String],
    default: [],
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.9,
  },
  reviewCount: {
    type: Number,
    default: 32,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  certifications: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    default: 'Central Sports Complex',
  },
  phone: {
    type: String,
    default: '+1 (555) 234-5678',
  },
  email: {
    type: String,
    default: 'coach@sportshub.com',
  },
  availableDays: {
    type: [String],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
