const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Football',
      'Basketball',
      'Volleyball',
      'Running',
      'Sports Clothes',
      'Fitness Equipment',
      'Dumbbells',
      'Yoga',
      'Cycling',
      'Boxing',
      'Swimming',
      'Gym Accessories',
      'Bags & Bottles',
      'Fitness Watches',
      'Tennis'
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 24,
  },
  stock: {
    type: Number,
    default: 50,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
  brand: {
    type: String,
    default: 'AeroSport',
  },
  badge: {
    type: String,
    default: '',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  sellerShopName: {
    type: String,
    default: 'AeroSport Official',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
