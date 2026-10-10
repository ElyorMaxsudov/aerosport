const mongoose = require('mongoose');

const trainerRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  clientPhone: {
    type: String,
    required: true,
  },
  goals: {
    type: String,
    required: true,
  },
  preferredSchedule: {
    type: String,
    default: 'Flexible / Weekdays',
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Completed', 'Declined'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('TrainerRequest', trainerRequestSchema);
