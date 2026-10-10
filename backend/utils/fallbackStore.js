// High-availability fallback store for zero-downtime deployments
const bcrypt = require('bcryptjs');

const usersById = new Map();
const usersByEmail = new Map();

// Helper to register in-memory user
const saveUser = (userData) => {
  const id = userData._id ? String(userData._id) : 'mem_' + Date.now() + Math.random().toString(36).substring(2, 7);
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

// Seed essential demo accounts in memory
saveUser({
  _id: 'seed_alex_001',
  name: 'Alex Johnson',
  username: 'alex_athlete',
  email: 'alex@example.com',
  password: 'password123',
  plainPassword: 'password123',
  role: 'user',
  bio: 'Marathon enthusiast and weekend football player.',
});

saveUser({
  _id: 'seed_admin_001',
  name: 'Admin Profile',
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'admin12345',
  plainPassword: 'admin12345',
  role: 'admin',
  bio: 'Bosh administrator',
});

saveUser({
  _id: 'seed_seller_001',
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

module.exports = {
  usersById,
  usersByEmail,
  saveUser,
};
