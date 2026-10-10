const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// In-memory fallback message store for 100% chat availability
const fallbackMessages = [];

// @desc    Get messages for a specific region and district
// @route   GET /api/chat/messages
// @access  Public / Protected
router.get('/messages', async (req, res) => {
  try {
    const { region, district, limit = 100 } = req.query;

    if (!region || !district) {
      return res.status(400).json({ message: 'Region and district query parameters are required' });
    }

    const cleanRegion = region.trim();
    const cleanDistrict = district.trim();

    let messages = [];

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        messages = await ChatMessage.find({
          region: cleanRegion,
          district: cleanDistrict,
        })
          .sort({ createdAt: 1 })
          .limit(Number(limit))
          .lean();
      } catch (dbErr) {
        console.warn('DB read chat error, using fallback:', dbErr.message);
      }
    }

    if (!messages || messages.length === 0) {
      messages = fallbackMessages.filter(
        (m) => m.region === cleanRegion && m.district === cleanDistrict
      );
    }

    // If no messages exist yet in this district room, provide an introductory welcoming chat message
    if (messages.length === 0) {
      const welcomeMsg = {
        _id: 'welcome_' + cleanDistrict.toLowerCase().replace(/\s+/g, '_'),
        user: '6aca4cd299ba20eaee8be401',
        userName: 'AeroSport Moderator',
        userUsername: 'aerosport_bot',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        userRole: 'admin',
        region: cleanRegion,
        district: cleanDistrict,
        message: `Salom! 👋 "${cleanRegion} - ${cleanDistrict}" sport jamoasi va havaskorlarining rasmiy chatiga xush kelibsiz! Bu yerda yugurish, marafon, mini-futbol o'yinlari va mashg'ulotlar haqida fikr almashing!`,
        systemMessage: true,
        messageType: 'text',
        createdAt: new Date().toISOString(),
      };
      fallbackMessages.push(welcomeMsg);
      messages = [welcomeMsg];
    }

    res.json(messages);
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).json({ message: err.message });
  }
});

// @desc    Send a message to user's region & district room
// @route   POST /api/chat/messages
// @access  Private
router.post('/messages', protect, async (req, res) => {
  try {
    const user = req.user;

    // Check if user is banned from chat
    if (user.isChatBanned) {
      return res.status(403).json({
        message: `Siz ma'muriyat tomonidan chatdan chiqarilgansiz! Sabab: ${user.chatBanReason || "Qoidalarni buzganlik uchun"}`,
        isChatBanned: true,
        chatBanReason: user.chatBanReason,
      });
    }

    const { audioUrl, audioData, audioDuration } = req.body;
    let finalAudioUrl = (audioUrl || audioData || '').trim();

    // If audio is sent as Base64 data URI (data:audio/webm;base64,...), save to disk or fallback to data URL
    if (finalAudioUrl.startsWith('data:audio')) {
      try {
        const matches = finalAudioUrl.match(/^data:audio\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const extension = matches[1] === 'mpeg' ? 'mp3' : (matches[1] || 'webm');
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const uploadDir = path.join(__dirname, '../public/uploads/audio');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const fileName = `voice_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
          fs.writeFileSync(path.join(uploadDir, fileName), buffer);
          finalAudioUrl = `/uploads/audio/${fileName}`;
        }
      } catch (err) {
        console.warn('Could not save audio to disk, using data URL fallback:', err.message);
      }
    }

    const messageText = (req.body.message || req.body.text || (finalAudioUrl ? '🎤 Ovozli xabar' : '')).trim();

    if (!messageText && !finalAudioUrl) {
      return res.status(400).json({ message: "Xabar matni yoki ovozli xabar bo'sh bo'lishi mumkin emas" });
    }

    // Use user's own region/district or payload if matched
    const targetRegion = (req.body.region || user.region || 'Toshkent shahri').trim();
    const targetDistrict = (req.body.district || user.district || 'Chilonzor tumani').trim();

    const mongoose = require('mongoose');
    const safeUserId = (user._id && mongoose.Types.ObjectId.isValid(user._id)) ? user._id : '6aca4cd299ba20eaee8be401';

    let newMsg = null;
    if (mongoose.connection.readyState === 1) {
      try {
        newMsg = await ChatMessage.create({
          user: safeUserId,
          userName: user.name,
          userUsername: user.username || user.email.split('@')[0],
          userAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          userRole: user.role || 'user',
          region: targetRegion,
          district: targetDistrict,
          message: messageText,
          messageType: finalAudioUrl ? 'audio' : 'text',
          audioUrl: finalAudioUrl,
          audioDuration: Number(audioDuration) || 0,
          systemMessage: false,
        });
      } catch (dbErr) {
        console.warn('DB write chat error, falling back to memory:', dbErr.message);
      }
    }

    if (!newMsg) {
      newMsg = {
        _id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(7),
        user: safeUserId,
        userName: user.name,
        userUsername: user.username || user.email.split('@')[0],
        userAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        userRole: user.role || 'user',
        region: targetRegion,
        district: targetDistrict,
        message: messageText,
        messageType: finalAudioUrl ? 'audio' : 'text',
        audioUrl: finalAudioUrl,
        audioDuration: Number(audioDuration) || 0,
        systemMessage: false,
        createdAt: new Date().toISOString(),
      };
      fallbackMessages.push(newMsg);
    }

    return res.status(201).json(newMsg);
  } catch (err) {
    console.error('Error sending chat message:', err);
    res.status(500).json({ message: err.message });
  }
});

// @desc    Upload voice message audio directly
// @route   POST /api/chat/upload-audio
// @access  Private
router.post('/upload-audio', protect, async (req, res) => {
  try {
    const { audioData, audioDuration } = req.body;
    if (!audioData) {
      return res.status(400).json({ message: "Ovozli fayl ma'lumotlari kiritilmadi" });
    }

    let audioUrl = audioData;
    if (audioData.startsWith('data:audio')) {
      try {
        const matches = audioData.match(/^data:audio\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const extension = matches[1] === 'mpeg' ? 'mp3' : (matches[1] || 'webm');
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const uploadDir = path.join(__dirname, '../public/uploads/audio');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const fileName = `voice_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
          fs.writeFileSync(path.join(uploadDir, fileName), buffer);
          audioUrl = `/uploads/audio/${fileName}`;
        }
      } catch (err) {
        console.warn('Audio save warning:', err.message);
      }
    }

    res.json({
      audioUrl,
      audioDuration: Number(audioDuration) || 0,
    });
  } catch (err) {
    console.error('Upload audio error:', err);
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get summary of active chat rooms (for admin & statistics)
// @route   GET /api/chat/rooms-summary
// @access  Public / Protected
router.get('/rooms-summary', async (req, res) => {
  try {
    const summary = await ChatMessage.aggregate([
      {
        $group: {
          _id: { region: '$region', district: '$district' },
          totalMessages: { $sum: 1 },
          lastMessageAt: { $max: '$createdAt' },
          users: { $addToSet: '$user' },
        },
      },
      {
        $project: {
          region: '$_id.region',
          district: '$_id.district',
          totalMessages: 1,
          lastMessageAt: 1,
          uniqueUsersCount: { $size: '$users' },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================================================
// ADMIN CHAT MANAGEMENT ROUTES
// ============================================================================

// @desc    Admin: Get all messages across all rooms with filtering
// @route   GET /api/chat/admin/all-messages
// @access  Private/Admin
router.get('/admin/all-messages', protect, admin, async (req, res) => {
  try {
    const { region, district, search, limit = 150 } = req.query;
    const filter = {};

    if (region && region !== 'all') {
      filter.region = region.trim();
    }
    if (district && district !== 'all') {
      filter.district = district.trim();
    }
    if (search && search.trim()) {
      filter.$or = [
        { message: { $regex: search.trim(), $options: 'i' } },
        { userName: { $regex: search.trim(), $options: 'i' } },
        { userUsername: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const messages = await ChatMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('user', 'name username email phone isChatBanned chatBanReason')
      .lean();

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admin: Delete a specific chat message
// @route   DELETE /api/chat/admin/messages/:id
// @access  Private/Admin
router.delete('/admin/messages/:id', protect, admin, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Xabar topilmadi' });
    }

    await ChatMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Xabar muvaffaqiyatli o'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admin: Get users for chat management (with region, district, ban status)
// @route   GET /api/chat/admin/users
// @access  Private/Admin
router.get('/admin/users', protect, admin, async (req, res) => {
  try {
    const { search, region, district, bannedOnly } = req.query;
    const filter = {};

    if (bannedOnly === 'true') {
      filter.isChatBanned = true;
    }
    if (region && region !== 'all') {
      filter.region = region.trim();
    }
    if (district && district !== 'all') {
      filter.district = district.trim();
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('name username email phone role avatar region district isChatBanned chatBanReason createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admin: Kick / Ban user from chat
// @route   POST /api/chat/admin/kick-user
// @access  Private/Admin
router.post('/admin/kick-user', protect, admin, async (req, res) => {
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Administratorni chatdan chiqarib bo\'lmaydi' });
    }

    const finalReason = reason?.trim() || "Chat qoidalarini buzganligi sababli ma'muriyat tomonidan chiqarildi";

    user.isChatBanned = true;
    user.chatBanReason = finalReason;
    await user.save();

    // Post an announcement system message in user's room
    try {
      await ChatMessage.create({
        user: req.user._id,
        userName: 'AeroSport Nazorat',
        userUsername: 'system_security',
        userRole: 'admin',
        region: user.region || 'Toshkent shahri',
        district: user.district || 'Chilonzor tumani',
        message: `⛔ Diqqat: Foydalanuvchi "${user.name}" (@${user.username || user.email.split('@')[0]}) ma'muriyat tomonidan chatdan chiqarildi. Sabab: ${finalReason}`,
        systemMessage: true,
      });
    } catch (e) {
      console.error('Failed to post system ban notification:', e);
    }

    res.json({
      message: `"${user.name}" muvaffaqiyatli chatdan chiqarildi!`,
      user: {
        _id: user._id,
        name: user.name,
        isChatBanned: user.isChatBanned,
        chatBanReason: user.chatBanReason,
        region: user.region,
        district: user.district,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admin: Unban / Restore user to chat
// @route   POST /api/chat/admin/unban-user
// @access  Private/Admin
router.post('/admin/unban-user', protect, admin, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    user.isChatBanned = false;
    user.chatBanReason = '';
    await user.save();

    res.json({
      message: `"${user.name}" uchun chatga kirish qayta tiklandi!`,
      user: {
        _id: user._id,
        name: user.name,
        isChatBanned: user.isChatBanned,
        chatBanReason: user.chatBanReason,
        region: user.region,
        district: user.district,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
