const express = require('express');
const router = express.Router();
const {
  getSchemes,
  checkEligibility
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getSchemes);

router.route('/check-eligibility')
  .post(checkEligibility);

module.exports = router;
