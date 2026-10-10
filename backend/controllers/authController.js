const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { usersById, usersByEmail, saveUser } = require('../utils/fallbackStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_sportshub_jwt_key_2026_fitness_pro', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      region,
      district,
      fitnessGoal,
      favoriteSports,
      isSeller,
      shopName,
      shopDescription,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Ism, email va parol kiritilishi shart' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const finalUsername = username ? username.trim() : cleanEmail.split('@')[0];

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({ message: 'Ushbu email bilan foydalanuvchi allaqachon mavjud' });
        }

        const user = await User.create({
          name: name.trim(),
          username: finalUsername,
          email: cleanEmail,
          password,
          plainPassword: password,
          role: isSeller ? 'seller' : 'user',
          isSeller: !!isSeller,
          shopName: shopName || '',
          shopDescription: shopDescription || '',
          phone: phone || '',
          region: region || 'Toshkent shahri',
          district: district || 'Chilonzor tumani',
          fitnessGoal: fitnessGoal || 'General Fitness',
          favoriteSports: favoriteSports || ['Running', 'Gym'],
        });

        if (user) {
          saveUser(user);
          return res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            isSeller: user.isSeller,
            shopName: user.shopName,
            shopDescription: user.shopDescription,
            avatar: user.avatar,
            bio: user.bio,
            phone: user.phone,
            region: user.region,
            district: user.district,
            isChatBanned: user.isChatBanned || false,
            chatBanReason: user.chatBanReason || '',
            fitnessGoal: user.fitnessGoal,
            favoriteSports: user.favoriteSports,
            token: generateToken(user._id),
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB register error, using resilient fallback store:', dbErr.message);
      }
    }

    // High-availability fallback store for cloud deployments
    if (usersByEmail.has(cleanEmail)) {
      return res.status(400).json({ message: 'Ushbu email bilan foydalanuvchi allaqachon mavjud' });
    }

    const fallbackUser = saveUser({
      name: name.trim(),
      username: finalUsername,
      email: cleanEmail,
      password,
      plainPassword: password,
      role: isSeller ? 'seller' : 'user',
      isSeller: !!isSeller,
      shopName: shopName || '',
      shopDescription: shopDescription || '',
      phone: phone || '',
      region: region || 'Toshkent shahri',
      district: district || 'Chilonzor tumani',
      fitnessGoal: fitnessGoal || 'General Fitness',
      favoriteSports: favoriteSports || ['Running', 'Gym'],
    });

    return res.status(201).json({
      _id: fallbackUser._id,
      name: fallbackUser.name,
      username: fallbackUser.username,
      email: fallbackUser.email,
      role: fallbackUser.role,
      isSeller: fallbackUser.isSeller,
      shopName: fallbackUser.shopName,
      shopDescription: fallbackUser.shopDescription,
      avatar: fallbackUser.avatar,
      bio: fallbackUser.bio,
      phone: fallbackUser.phone,
      region: fallbackUser.region,
      district: fallbackUser.district,
      isChatBanned: false,
      chatBanReason: '',
      fitnessGoal: fallbackUser.fitnessGoal,
      favoriteSports: fallbackUser.favoriteSports,
      token: generateToken(fallbackUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Secret Admin Login: admin@gmail.com with password 'adimin12345' (or 'admin12345')
    if (
      cleanEmail === 'admin@gmail.com' &&
      (password === 'adimin12345' || password === 'admin12345')
    ) {
      let adminUser = await User.findOne({ email: 'admin@gmail.com' });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Admin Profile',
          username: 'admin',
          email: 'admin@gmail.com',
          password: password,
          plainPassword: password,
          role: 'admin',
          isSeller: false,
          phone: '+998 (90) 000-00-01',
          bio: 'Bosh administrator',
        });
      } else {
        adminUser.name = 'Admin Profile';
        adminUser.role = 'admin';
        adminUser.plainPassword = password;
        await adminUser.save();
      }

      return res.json({
        _id: adminUser._id,
        name: adminUser.name,
        username: adminUser.username || 'admin',
        email: adminUser.email,
        role: 'admin',
        isSeller: false,
        avatar: adminUser.avatar,
        bio: adminUser.bio,
        phone: adminUser.phone,
        region: adminUser.region || 'Toshkent shahri',
        district: adminUser.district || 'Chilonzor tumani',
        isChatBanned: false,
        chatBanReason: '',
        token: generateToken(adminUser._id),
      });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user && (await user.matchPassword(password))) {
          return res.json({
            _id: user._id,
            name: user.name,
            username: user.username || user.email.split('@')[0],
            email: user.email,
            role: user.role,
            isSeller: user.isSeller,
            shopName: user.shopName,
            shopDescription: user.shopDescription,
            avatar: user.avatar,
            bio: user.bio,
            phone: user.phone,
            region: user.region || 'Toshkent shahri',
            district: user.district || 'Chilonzor tumani',
            isChatBanned: user.isChatBanned || false,
            chatBanReason: user.chatBanReason || '',
            fitnessGoal: user.fitnessGoal,
            favoriteSports: user.favoriteSports,
            height: user.height,
            weight: user.weight,
            token: generateToken(user._id),
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB login query error, checking fallback store:', dbErr.message);
      }
    }

    // Check fallback store
    const fallbackUser = usersByEmail.get(cleanEmail);
    if (fallbackUser && (await fallbackUser.matchPassword(password))) {
      return res.json({
        _id: fallbackUser._id,
        name: fallbackUser.name,
        username: fallbackUser.username || fallbackUser.email.split('@')[0],
        email: fallbackUser.email,
        role: fallbackUser.role,
        isSeller: fallbackUser.isSeller,
        shopName: fallbackUser.shopName,
        shopDescription: fallbackUser.shopDescription,
        avatar: fallbackUser.avatar,
        bio: fallbackUser.bio,
        phone: fallbackUser.phone,
        region: fallbackUser.region || 'Toshkent shahri',
        district: fallbackUser.district || 'Chilonzor tumani',
        isChatBanned: false,
        chatBanReason: '',
        fitnessGoal: fallbackUser.fitnessGoal,
        favoriteSports: fallbackUser.favoriteSports,
        height: fallbackUser.height,
        weight: fallbackUser.weight,
        token: generateToken(fallbackUser._id),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && !String(req.user._id).startsWith('mem_') && !String(req.user._id).startsWith('seed_')) {
      try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) return res.json(user);
      } catch (dbErr) {}
    }

    const fallbackUser = usersById.get(String(req.user._id));
    if (fallbackUser) {
      return res.json(fallbackUser);
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    let updatedObj = null;

    if (mongoose.connection.readyState === 1 && !String(req.user._id).startsWith('mem_') && !String(req.user._id).startsWith('seed_')) {
      try {
        const user = await User.findById(req.user._id);
        if (user) {
          user.name = req.body.name || user.name;
          if (req.body.username !== undefined) user.username = req.body.username.trim();
          user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
          user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
          user.avatar = req.body.avatar || user.avatar;
          user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;
          user.favoriteSports = req.body.favoriteSports || user.favoriteSports;
          user.height = req.body.height !== undefined ? req.body.height : user.height;
          user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
          if (req.body.region) user.region = req.body.region.trim();
          if (req.body.district) user.district = req.body.district.trim();
          if (req.body.password) {
            user.password = req.body.password;
            user.plainPassword = req.body.password;
          }
          const saved = await user.save();
          saveUser(saved);
          updatedObj = saved;
        }
      } catch (dbErr) {
        console.warn('MongoDB updateUserProfile error, updating fallback store:', dbErr.message);
      }
    }

    if (!updatedObj) {
      const existing = usersById.get(String(req.user._id)) || req.user;
      const merged = {
        ...existing,
        name: req.body.name || existing.name,
        username: req.body.username ? req.body.username.trim() : existing.username,
        phone: req.body.phone !== undefined ? req.body.phone : existing.phone,
        bio: req.body.bio !== undefined ? req.body.bio : existing.bio,
        avatar: req.body.avatar || existing.avatar,
        fitnessGoal: req.body.fitnessGoal || existing.fitnessGoal,
        favoriteSports: req.body.favoriteSports || existing.favoriteSports,
        height: req.body.height !== undefined ? req.body.height : existing.height,
        weight: req.body.weight !== undefined ? req.body.weight : existing.weight,
        region: req.body.region ? req.body.region.trim() : existing.region,
        district: req.body.district ? req.body.district.trim() : existing.district,
      };
      saveUser(merged);
      updatedObj = merged;
    }

    return res.json({
      _id: updatedObj._id,
      name: updatedObj.name,
      username: updatedObj.username || updatedObj.email?.split('@')[0],
      email: updatedObj.email,
      role: updatedObj.role,
      isSeller: updatedObj.isSeller,
      shopName: updatedObj.shopName,
      shopDescription: updatedObj.shopDescription,
      avatar: updatedObj.avatar,
      bio: updatedObj.bio,
      phone: updatedObj.phone,
      region: updatedObj.region,
      district: updatedObj.district,
      isChatBanned: updatedObj.isChatBanned || false,
      chatBanReason: updatedObj.chatBanReason || '',
      fitnessGoal: updatedObj.fitnessGoal,
      favoriteSports: updatedObj.favoriteSports,
      height: updatedObj.height,
      weight: updatedObj.weight,
      token: generateToken(updatedObj._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
