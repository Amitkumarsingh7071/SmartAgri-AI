const Finance = require('../models/Finance');
const Farm = require('../models/Farm');

// @desc    Get all transactions (expenses & incomes)
// @route   GET /api/finance
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Finance.find({ userId: req.user._id })
      .populate('farmId', 'name')
      .sort({ date: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new transaction
// @route   POST /api/finance
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, farmId, crop, description, date } = req.body;

    if (farmId) {
      const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
      if (!farm) {
        return res.status(404).json({ success: false, message: 'Associated farm not found or unauthorized' });
      }
    }

    const transaction = await Finance.create({
      userId: req.user._id,
      type,
      category,
      amount: Number(amount),
      farmId,
      crop,
      description,
      date: date || Date.now()
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/finance/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
    }
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get financial analytics (KPIs + Chart Data)
// @route   GET /api/finance/analytics
// @access  Private
const getFinanceAnalytics = async (req, res) => {
  try {
    const transactions = await Finance.find({ userId: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown = {};
    const monthlyTrend = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }

      // Category breakdown
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;

      // Monthly Trend (Key format: YYYY-MM)
      const dateObj = new Date(t.date);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyTrend[monthKey]) {
        monthlyTrend[monthKey] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        monthlyTrend[monthKey].income += t.amount;
      } else {
        monthlyTrend[monthKey].expense += t.amount;
      }
    });

    // Format monthly trend for charts (sorted chronologically)
    const sortedMonths = Object.keys(monthlyTrend).sort();
    const trendData = sortedMonths.map(month => {
      const [year, m] = month.split('-');
      const monthName = new Date(year, m - 1).toLocaleString('default', { month: 'short' });
      return {
        label: `${monthName} ${year}`,
        income: monthlyTrend[month].income,
        expense: monthlyTrend[month].expense,
        profit: monthlyTrend[month].income - monthlyTrend[month].expense
      };
    });

    // Format categories for pie charts
    const categoryData = Object.keys(categoryBreakdown).map(cat => ({
      category: cat,
      value: categoryBreakdown[cat]
    }));

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense,
        trend: trendData,
        categories: categoryData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getFinanceAnalytics
};
