const InputPrice = require('../models/InputPrice');

const initialInputPrices = [
  { name: 'Neem Coated Urea', category: 'Fertilizer', unit: '50kg Bag', govtRate: 266, privateRate: 310, subsidyPct: 70, trend: 'STABLE', availability: 'In Stock' },
  { name: 'Di-Ammonium Phosphate (DAP)', category: 'Fertilizer', unit: '50kg Bag', govtRate: 1350, privateRate: 1520, subsidyPct: 45, trend: 'RISING', availability: 'In Stock' },
  { name: 'Muriate of Potash (MOP)', category: 'Fertilizer', unit: '50kg Bag', govtRate: 1700, privateRate: 1950, subsidyPct: 30, trend: 'STABLE', availability: 'Limited Stock' },
  { name: 'NPK 19-19-19 Soluble', category: 'Fertilizer', unit: '50kg Bag', govtRate: 1450, privateRate: 1680, subsidyPct: 25, trend: 'FALLING', availability: 'In Stock' },
  { name: 'Copper Oxychloride 50 WP', category: 'Fungicide', unit: '1kg Pack', govtRate: 420, privateRate: 490, subsidyPct: 15, trend: 'STABLE', availability: 'In Stock' },
  { name: 'Neem Oil Bio-Pesticide (1500 ppm)', category: 'Bio-Control', unit: '1 Litre Bottle', govtRate: 280, privateRate: 340, subsidyPct: 20, trend: 'STABLE', availability: 'In Stock' },
  { name: 'Streptocycline Bactericide', category: 'Pesticide', unit: '6g Pack', govtRate: 45, privateRate: 60, subsidyPct: 10, trend: 'STABLE', availability: 'In Stock' },
  { name: 'Mancozeb 75 WP Fungicide', category: 'Fungicide', unit: '1kg Pack', govtRate: 380, privateRate: 440, subsidyPct: 15, trend: 'STABLE', availability: 'In Stock' }
];

// @desc    Get All Fertilizer & Chemical Prices
// @route   GET /api/inputs/prices
// @access  Private
const getInputPrices = async (req, res) => {
  try {
    let prices = await InputPrice.find().sort({ category: 1 });

    if (prices.length === 0) {
      prices = await InputPrice.insertMany(initialInputPrices);
    }

    res.json({ success: true, count: prices.length, data: prices });
  } catch (error) {
    console.error('getInputPrices error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInputPrices
};
