const express = require('express');
const router = express.Router();
const { processVoiceQuery } = require('../controllers/voiceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/query', processVoiceQuery);

module.exports = router;
