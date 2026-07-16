const express = require('express');
const router = Router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getFinanceAnalytics
} = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/analytics')
  .get(getFinanceAnalytics);

router.route('/:id')
  .delete(deleteTransaction);

module.exports = router;
