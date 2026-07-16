const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true // in acres
  },
  soilType: {
    type: String,
    required: true
  },
  waterSource: {
    type: String,
    required: true // e.g., 'Borewell', 'Canal', 'Rainfed', 'Drip Irrigation'
  },
  previousCrop: {
    type: String
  },
  currentCrop: {
    type: String
  },
  expectedHarvestDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farm', FarmSchema);
