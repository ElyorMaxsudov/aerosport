const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userUsername: {
      type: String,
      default: '',
      trim: true,
    },
    userAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    userRole: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user',
    },
    region: {
      type: String,
      required: [true, 'Region is required for chat room'],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: [true, 'District is required for chat room'],
      trim: true,
      index: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'audio', 'system'],
      default: 'text',
    },
    audioUrl: {
      type: String,
      default: '',
      trim: true,
    },
    audioDuration: {
      type: Number,
      default: 0,
    },
    systemMessage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for ultra-fast room query
chatMessageSchema.index({ region: 1, district: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
