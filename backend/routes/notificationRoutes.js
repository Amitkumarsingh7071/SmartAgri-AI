const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// @desc    Get current user notifications (including broadcasts)
// @route   GET /api/notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { userId: req.user._id },
        { userId: null }
      ]
    }).sort({ createdAt: -1 }).limit(50);
    
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
