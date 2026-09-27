const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getFeedbackStats,
  getCalendarTasks,
  createCalendarTask,
  updateTaskStatus,
  getFarmRiskEngine,
  getBiosecurityHotspots
} = require('../controllers/farmerFeatureController');

router.post('/feedback', submitFeedback);
router.get('/feedback/stats', getFeedbackStats);

router.get('/calendar', getCalendarTasks);
router.post('/calendar', createCalendarTask);
router.put('/calendar/:id', updateTaskStatus);

router.get('/risk-engine', getFarmRiskEngine);
router.get('/biosecurity', getBiosecurityHotspots);

module.exports = router;
