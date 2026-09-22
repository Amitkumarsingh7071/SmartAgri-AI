const express = require('express');
const router = express.Router();
const {
  getWeatherData,
  getWeatherAlerts,
  getWeatherRecommendations
} = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWeatherData);
router.get('/alerts', getWeatherAlerts);
router.get('/recommendations', getWeatherRecommendations);

module.exports = router;
