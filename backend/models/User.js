const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  username: {
    type: String,
    default: '',
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  plainPassword: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
  shopName: {
    type: String,
    default: '',
  },
  shopDescription: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  bio: {
    type: String,
    default: 'Sports & fitness enthusiast',
  },
  fitnessGoal: {
    type: String,
    default: 'General Fitness',
  },
  favoriteSports: {
    type: [String],
    default: ['Running', 'Gym'],
  },
  height: {
    type: Number,
    default: 175,
  },
  weight: {
    type: Number,
    default: 70,
  },
  region: {
    type: String,
    default: 'Toshkent shahri',
    trim: true,
  },
  district: {
    type: String,
    default: 'Chilonzor tumani',
    trim: true,
  },
  isChatBanned: {
    type: Boolean,
    default: false,
  },
  chatBanReason: {
    type: String,
    default: '',
    trim: true,
  },
}, { timestamps: true });

// Password hashing middleware before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
