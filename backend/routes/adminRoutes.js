const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Event = require('../models/Event');
const Facility = require('../models/Facility');
const Booking = require('../models/Booking');
const Trainer = require('../models/Trainer');
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalFacilities = await Facility.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalTrainers = await Trainer.countDocuments();

    const totalSellers = await User.countDocuments({
      $or: [
        { isSeller: true },
        { role: 'seller' },
        { shopName: { $exists: true, $ne: '' } }
      ]
    });

    // Calculate total revenue from orders and bookings
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    const bookings = await Booking.find();
    const bookingRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    res.json({
      totalUsers,
      totalSellers,
      totalProducts,
      totalEvents,
      totalFacilities,
      totalTrainers,
      totalBookings,
      totalOrders,
      totalRevenue: totalRevenue + bookingRevenue,
      productRevenue: totalRevenue,
      bookingRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all registered sellers with their shop stats (products listed, items sold, revenue)
// @route   GET /api/admin/sellers
// @access  Private/Admin
router.get('/sellers', protect, admin, async (req, res) => {
  try {
    const sellers = await User.find({
      $or: [
        { isSeller: true },
        { role: 'seller' },
        { shopName: { $exists: true, $ne: '' } }
      ]
    }).select('-password').sort({ createdAt: -1 });

    const allProducts = await Product.find();
    const allOrders = await Order.find();

    const sellersWithStats = sellers.map((seller) => {
      // Find products of this seller
      const sellerProducts = allProducts.filter((p) => {
        return (
          (p.seller && String(p.seller) === String(seller._id)) ||
          (p.sellerShopName && seller.shopName && p.sellerShopName.toLowerCase() === seller.shopName.toLowerCase()) ||
          (p.brand && seller.shopName && p.brand.toLowerCase() === seller.shopName.toLowerCase())
        );
      });

      const productIds = new Set(sellerProducts.map((p) => String(p._id)));
      const productNames = new Set(sellerProducts.map((p) => p.name.toLowerCase()));

      let itemsSold = 0;
      let totalRevenue = 0;
      let ordersCount = 0;

      allOrders.forEach((order) => {
        if (order.status === 'Cancelled') return;
        let matchedInOrder = false;

        (order.items || []).forEach((item) => {
          const isSellerItem =
            (item.product && productIds.has(String(item.product))) ||
            (item.name && productNames.has(item.name.toLowerCase()));

          if (isSellerItem) {
            itemsSold += Number(item.quantity || 1);
            totalRevenue += Number((item.price || 0) * (item.quantity || 1));
            matchedInOrder = true;
          }
        });

        if (matchedInOrder) {
          ordersCount += 1;
        }
      });

      const totalStock = sellerProducts.reduce((sum, p) => sum + (p.stock || 0), 0);

      return {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone || '+998 -- --- -- --',
        avatar: seller.avatar,
        shopName: seller.shopName || `${seller.name} Sport Do'koni`,
        shopDescription: seller.shopDescription || 'Sport mahsulotlari va anjomlari do\'koni',
        role: seller.role,
        isSeller: seller.isSeller,
        createdAt: seller.createdAt,
        productsCount: sellerProducts.length,
        totalStock,
        itemsSold,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        ordersCount,
        products: sellerProducts.map((p) => ({
          _id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          image: p.image,
          badge: p.badge,
        })),
      };
    });

    res.json(sellersWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Delete / deactivate seller (Admin)
// @route   DELETE /api/admin/sellers/:id
// @access  Private/Admin
router.delete('/sellers/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Seller not found' });
    user.role = 'user';
    user.isSeller = false;
    await user.save();
    res.json({ message: 'Seller deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put('/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
router.get('/bookings', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
router.put('/bookings/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create new facility (Admin)
// @route   POST /api/admin/facilities
// @access  Private/Admin
router.post('/facilities', protect, admin, async (req, res) => {
  try {
    const facility = new Facility(req.body);
    const created = await facility.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete facility
// @route   DELETE /api/admin/facilities/:id
// @access  Private/Admin
router.delete('/facilities/:id', protect, admin, async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ message: 'Facility deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
router.delete('/events/:id', protect, admin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all users (Admin only) - Passwords Hidden for Security
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password -plainPassword').sort({ createdAt: -1 });
    const formatted = users.map((u) => ({
      _id: u._id,
      name: u.name,
      username: u.username || u.email.split('@')[0],
      email: u.email,
      role: u.role,
      isSeller: u.isSeller,
      shopName: u.shopName || '',
      phone: u.phone || '',
      avatar: u.avatar,
      createdAt: u.createdAt,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all trainers (Admin)
// @route   GET /api/admin/trainers
// @access  Private/Admin
router.get('/trainers', protect, admin, async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create new trainer by Admin
// @route   POST /api/admin/trainers
// @access  Private/Admin
router.post('/trainers', protect, admin, async (req, res) => {
  try {
    const {
      name,
      title,
      specialization,
      pricePerHour,
      experienceYears,
      image,
      bio,
      phone,
      email,
      rating,
      sports,
    } = req.body;

    if (!name || !title || !specialization || pricePerHour === undefined) {
      return res.status(400).json({ message: 'Ism, unvon, yo\'nalish va soatlik narx kiritilishi shart' });
    }

    const trainer = new Trainer({
      name: name.trim(),
      title: title.trim(),
      specialization: specialization.trim(),
      pricePerHour: Number(pricePerHour),
      experienceYears: Number(experienceYears) || 3,
      image: image?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: bio?.trim() || 'Professional malakali sport murabbiyi.',
      phone: phone?.trim() || '+998 (90) 123-45-67',
      email: email?.trim() || 'coach@sportshub.com',
      rating: Number(rating) || 4.9,
      sports: Array.isArray(sports) && sports.length > 0 ? sports : [specialization.trim()],
    });

    const saved = await trainer.save();
    res.status(201).json({ message: 'Trainer created successfully', trainer: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update trainer details by Admin
// @route   PUT /api/admin/trainers/:id
// @access  Private/Admin
router.put('/trainers/:id', protect, admin, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    if (req.body.name) trainer.name = req.body.name.trim();
    if (req.body.title) trainer.title = req.body.title.trim();
    if (req.body.specialization) trainer.specialization = req.body.specialization.trim();
    if (req.body.pricePerHour !== undefined) trainer.pricePerHour = Number(req.body.pricePerHour);
    if (req.body.experienceYears !== undefined) trainer.experienceYears = Number(req.body.experienceYears);
    if (req.body.image) trainer.image = req.body.image.trim();
    if (req.body.bio) trainer.bio = req.body.bio.trim();
    if (req.body.phone) trainer.phone = req.body.phone.trim();
    if (req.body.email) trainer.email = req.body.email.trim();
    if (req.body.rating !== undefined) trainer.rating = Number(req.body.rating);
    if (req.body.sports && Array.isArray(req.body.sports)) trainer.sports = req.body.sports;

    const saved = await trainer.save();
    res.json({ message: 'Trainer updated successfully', trainer: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Delete trainer by Admin
// @route   DELETE /api/admin/trainers/:id
// @access  Private/Admin
router.delete('/trainers/:id', protect, admin, async (req, res) => {
  try {
    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trainer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update user credentials (username, name, password) by Admin
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.username) user.username = req.body.username.trim();
    if (req.body.role) user.role = req.body.role;
    if (req.body.password) {
      user.password = req.body.password;
      user.plainPassword = req.body.password;
    }

    await user.save();
    res.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        plainPassword: user.plainPassword,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Delete user by Admin
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin' && user.email === 'admin@gmail.com') {
      return res.status(400).json({ message: 'Cannot delete primary admin account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all products for price management (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update product details (description, price, original price, stock, name) (Admin)
// @route   PUT /api/admin/products/:id/price
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const handleAdminProductUpdate = async (req, res) => {
  try {
    const { name, description, price, originalPrice, stock, category, brand, image, badge } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category;
    if (brand) product.brand = brand.trim();
    if (image) product.image = image.trim();
    if (badge !== undefined) product.badge = badge;

    const saved = await product.save();
    res.json({ message: 'Product updated successfully', product: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.put('/products/:id/price', protect, admin, handleAdminProductUpdate);
router.put('/products/:id', protect, admin, handleAdminProductUpdate);

// @desc    Get currency rates
// @route   GET /api/admin/currency-rates
// @access  Public
router.get('/currency-rates', async (req, res) => {
  try {
    let setting = await Setting.findOne({ key: 'currency_settings' });
    if (!setting) {
      setting = await Setting.create({
        key: 'currency_settings',
        value: {
          baseCurrency: 'UZS',
          rates: {
            UZS: 1,
            USD: 12800,
            EUR: 13800,
            RUB: 135,
          },
          lastUpdated: new Date(),
        },
      });
    }
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update currency rates (Admin)
// @route   PUT /api/admin/currency-rates
// @access  Private/Admin
router.put('/currency-rates', protect, admin, async (req, res) => {
  try {
    const { rates, baseCurrency } = req.body;
    let setting = await Setting.findOne({ key: 'currency_settings' });

    const updatedValue = {
      baseCurrency: baseCurrency || setting?.value?.baseCurrency || 'UZS',
      rates: {
        UZS: 1,
        USD: Number(rates?.USD) || setting?.value?.rates?.USD || 12800,
        EUR: Number(rates?.EUR) || setting?.value?.rates?.EUR || 13800,
        RUB: Number(rates?.RUB) || setting?.value?.rates?.RUB || 135,
      },
      lastUpdated: new Date(),
    };

    if (!setting) {
      setting = await Setting.create({
        key: 'currency_settings',
        value: updatedValue,
      });
    } else {
      setting.value = updatedValue;
      setting.markModified('value');
      await setting.save();
    }

    res.json({ message: 'Currency rates updated successfully', data: setting.value });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
