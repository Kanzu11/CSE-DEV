const express = require('express');
const router = express.Router();
const { chat, getHistory, deleteHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, chat);
router.get('/', protect, getHistory);
router.delete('/:id', protect, deleteHistory);

module.exports = router;
