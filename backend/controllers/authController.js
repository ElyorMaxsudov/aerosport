const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const finalUsername = username ? username.trim() : email.split('@')[0];

    const user = await User.create({
      name,
      username: finalUsername,
      email,
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
      res.status(201).json({
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
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
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

    const user = await User.findOne({ email: cleanEmail });

    if (user && (await user.matchPassword(password))) {
      res.json({
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
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.username !== undefined) {
        user.username = req.body.username.trim();
      }
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.avatar = req.body.avatar || user.avatar;
      user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;
      user.favoriteSports = req.body.favoriteSports || user.favoriteSports;
      user.height = req.body.height !== undefined ? req.body.height : user.height;
      user.weight = req.body.weight !== undefined ? req.body.weight : user.weight;
      if (req.body.region) {
        user.region = req.body.region.trim();
      }
      if (req.body.district) {
        user.district = req.body.district.trim();
      }

      if (req.body.password) {
        user.password = req.body.password;
        user.plainPassword = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username || updatedUser.email.split('@')[0],
        email: updatedUser.email,
        role: updatedUser.role,
        isSeller: updatedUser.isSeller,
        shopName: updatedUser.shopName,
        shopDescription: updatedUser.shopDescription,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        region: updatedUser.region,
        district: updatedUser.district,
        isChatBanned: updatedUser.isChatBanned || false,
        chatBanReason: updatedUser.chatBanReason || '',
        fitnessGoal: updatedUser.fitnessGoal,
        favoriteSports: updatedUser.favoriteSports,
        height: updatedUser.height,
        weight: updatedUser.weight,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
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
