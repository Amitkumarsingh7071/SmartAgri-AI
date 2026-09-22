const express = require('express');
const router = express.Router();
const { getInputPrices } = require('../controllers/inputPriceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/prices', getInputPrices);

module.exports = router;
