const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
  },
  facilityName: {
    type: String,
    required: true,
  },
  facilityType: {
    type: String,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Completed', 'Cancelled'],
    default: 'Confirmed',
  },
}, { timestamps: true });

// Ensure unique booking per facility + date + slot unless cancelled
bookingSchema.index({ facility: 1, date: 1, timeSlot: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
