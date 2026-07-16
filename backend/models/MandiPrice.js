const mongoose = require('mongoose');

const MandiPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    index: true
  },
  market: {
    type: String,
    required: true
  },
  price: {
    type: Number, // price per quintal (100 kg) in INR
    required: true
  },
  state: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MandiPrice', MandiPriceSchema);
