const express = require('express');
const router = express.Router();
const {
  getMandiPrices,
  getMandiPriceHistory,
  estimateProfit
} = require('../controllers/priceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getMandiPrices);

router.route('/history')
  .get(getMandiPriceHistory);

router.route('/estimate-profit')
  .post(estimateProfit);

module.exports = router;
