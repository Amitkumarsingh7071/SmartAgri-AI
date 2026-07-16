const MandiPrice = require('../models/MandiPrice');

// @desc    Get all current Mandi prices
// @route   GET /api/prices
// @access  Private
const getMandiPrices = async (req, res) => {
  try {
    const { crop, state } = req.query;
    const filter = {};
    if (crop) filter.crop = { $regex: crop, $options: 'i' };
    if (state) filter.state = { $regex: state, $options: 'i' };

    const prices = await MandiPrice.find(filter).sort({ date: -1 }).limit(100);
    res.json({ success: true, count: prices.length, data: prices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Mandi price history for analytics (grouped by crop)
// @route   GET /api/prices/history
// @access  Private
const getMandiPriceHistory = async (req, res) => {
  try {
    const { crop } = req.query;
    if (!crop) {
      return res.status(400).json({ success: false, message: 'Crop parameter is required' });
    }

    const history = await MandiPrice.find({ crop: { $regex: `^${crop}$`, $options: 'i' } })
      .sort({ date: 1 })
      .limit(30); // Last 30 recordings

    res.json({ success: true, data: history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Profit Estimator based on market price
// @route   POST /api/prices/estimate-profit
// @access  Private
const estimateProfit = async (req, res) => {
  try {
    const { crop, quantityQuintals, expenseAmt } = req.body;

    if (!crop || !quantityQuintals || expenseAmt === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide crop, quantity, and production expenses.' });
    }

    // Find the highest Mandi price for this crop to give the farmer the best selling point recommendation
    const bestMarket = await MandiPrice.findOne({ crop: { $regex: `^${crop}$`, $options: 'i' } })
      .sort({ price: -1 });

    if (!bestMarket) {
      return res.status(404).json({
        success: false,
        message: `No market pricing data found for crop: ${crop}. Try Wheat, Rice, Cotton, or Sugarcane.`
      });
    }

    const pricePerQuintal = bestMarket.price;
    const estimatedRevenue = pricePerQuintal * Number(quantityQuintals);
    const estimatedProfit = estimatedRevenue - Number(expenseAmt);

    res.json({
      success: true,
      data: {
        crop: bestMarket.crop,
        recommendedMarket: bestMarket.market,
        recommendedState: bestMarket.state,
        currentMandiPrice: pricePerQuintal,
        estimatedRevenue,
        productionExpenses: Number(expenseAmt),
        estimatedNetProfit: estimatedProfit,
        profitPercentage: ((estimatedProfit / Number(expenseAmt)) * 100).toFixed(2),
        isProfit: estimatedProfit >= 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMandiPrices,
  getMandiPriceHistory,
  estimateProfit
};
