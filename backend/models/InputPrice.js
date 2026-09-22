const mongoose = require('mongoose');

const InputPriceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Fertilizer', 'Pesticide', 'Fungicide', 'Bio-Control'],
    required: true
  },
  unit: {
    type: String,
    required: true,
    default: '50kg Bag'
  },
  govtRate: {
    type: Number,
    required: true
  },
  privateRate: {
    type: Number,
    required: true
  },
  subsidyPct: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    enum: ['STABLE', 'RISING', 'FALLING'],
    default: 'STABLE'
  },
  availability: {
    type: String,
    enum: ['In Stock', 'Limited Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InputPrice', InputPriceSchema);
