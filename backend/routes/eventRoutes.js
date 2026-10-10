const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  joinEvent,
  leaveEvent,
  getMyEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/my/registrations', protect, getMyEvents);
router.get('/:id', getEventById);
router.post('/', protect, createEvent);
router.post('/:id/join', protect, joinEvent);
router.post('/:id/leave', protect, leaveEvent);

module.exports = router;
