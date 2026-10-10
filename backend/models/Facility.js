const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['mini_football', 'gym', 'sports_hall', 'basketball', 'tennis'],
  },
  title: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 4.9,
  },
  reviewsCount: {
    type: Number,
    default: 45,
  },
  surface: {
    type: String,
    default: 'Premium Turf',
  },
  dimensions: {
    type: String,
    default: '42m x 22m',
  },
  capacity: {
    type: String,
    default: '10-14 Players',
  },
  image: {
    type: String,
    required: true,
  },
  gallery: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: ['Lighting', 'Locker Room', 'Showers', 'Parking', 'Free Wi-Fi', 'Ball & Bib Rental'],
  },
  availableSlots: {
    type: [String],
    default: [
      '08:00 - 09:00',
      '09:00 - 10:00',
      '10:00 - 11:00',
      '14:00 - 15:00',
      '16:00 - 17:00',
      '18:00 - 19:00',
      '19:00 - 20:00',
      '20:00 - 21:00',
      '21:00 - 22:00',
      '22:00 - 23:00'
    ],
  },
  description: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '+1 (555) 019-2834',
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
