// High-availability fallback store for zero-downtime deployments
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const usersById = new Map();
const usersByEmail = new Map();

// Helper to register in-memory user with valid ObjectId format
const saveUser = (userData) => {
  let id = userData._id ? String(userData._id) : '';
  if (!id || (!mongoose.Types.ObjectId.isValid(id) && !id.startsWith('seed_'))) {
    id = new mongoose.Types.ObjectId().toString();
  }
  const cleanEmail = userData.email.toLowerCase().trim();
  const userObj = {
    _id: id,
    name: userData.name || 'Athlete',
    username: userData.username || cleanEmail.split('@')[0],
    email: cleanEmail,
    password: userData.password,
    plainPassword: userData.plainPassword || userData.password,
    role: userData.role || 'user',
    isSeller: !!userData.isSeller,
    shopName: userData.shopName || '',
    shopDescription: userData.shopDescription || '',
    phone: userData.phone || '',
    region: userData.region || 'Toshkent shahri',
    district: userData.district || 'Chilonzor tumani',
    bio: userData.bio || 'Sports & fitness enthusiast',
    fitnessGoal: userData.fitnessGoal || 'General Fitness',
    favoriteSports: userData.favoriteSports || ['Running', 'Gym'],
    height: userData.height || 175,
    weight: userData.weight || 70,
    avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isChatBanned: false,
    chatBanReason: '',
    createdAt: new Date().toISOString(),
    matchPassword: async function (enteredPassword) {
      if (this.plainPassword && this.plainPassword === enteredPassword) return true;
      try {
        return await bcrypt.compare(enteredPassword, this.password);
      } catch (e) {
        return false;
      }
    },
  };
  usersById.set(id, userObj);
  usersByEmail.set(cleanEmail, userObj);
  return userObj;
};

// Seed essential demo accounts with valid 24-hex ObjectIds
const alexId = '6aca4cd299ba20eaee8be401';
const alexUser = saveUser({
  _id: alexId,
  name: 'Alex Johnson',
  username: 'alex_athlete',
  email: 'alex@example.com',
  password: 'password123',
  plainPassword: 'password123',
  role: 'user',
  bio: 'Marathon enthusiast and weekend football player.',
});
usersById.set('seed_alex_001', alexUser);

const adminId = '6aca4cd299ba20eaee8be402';
const adminUser = saveUser({
  _id: adminId,
  name: 'Admin Profile',
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'admin12345',
  plainPassword: 'admin12345',
  role: 'admin',
  bio: 'Bosh administrator',
});
usersById.set('seed_admin_001', adminUser);

const sellerId = '6aca4cd299ba20eaee8be403';
const sellerUser = saveUser({
  _id: sellerId,
  name: 'Sardor Rahimiy',
  username: 'pro_sports_shop',
  email: 'seller1@example.com',
  password: 'password123',
  plainPassword: 'password123',
  role: 'seller',
  isSeller: true,
  shopName: 'ProSports Tashkent',
  bio: 'Official athletic gear retailer.',
});
usersById.set('seed_seller_001', sellerUser);

module.exports = {
  usersById,
  usersByEmail,
  saveUser,
};
