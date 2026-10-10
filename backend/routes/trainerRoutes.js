const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainerById,
  createTrainerRequest,
  getMyTrainerRequests,
  updateTrainer,
} = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getTrainers);
router.get('/my/requests', protect, getMyTrainerRequests);
router.get('/:id', getTrainerById);
router.post('/:id/request', protect, createTrainerRequest);
router.put('/:id', protect, updateTrainer);

module.exports = router;
