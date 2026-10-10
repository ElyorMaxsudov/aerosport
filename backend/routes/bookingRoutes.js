const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacilityById,
  getFacilityBookedSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/facilities', getFacilities);
router.get('/facilities/:id', getFacilityById);
router.get('/facilities/:id/slots', getFacilityBookedSlots);
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
