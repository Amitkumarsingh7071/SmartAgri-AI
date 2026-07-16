const mongoose = require('mongoose');

const SoilRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  N: {
    type: Number, // Nitrogen (mg/kg or ppm)
    required: true
  },
  P: {
    type: Number, // Phosphorus (mg/kg or ppm)
    required: true
  },
  K: {
    type: Number, // Potassium (mg/kg or ppm)
    required: true
  },
  pH: {
    type: Number, // Soil pH
    required: true
  },
  organicCarbon: {
    type: Number, // Percentage (%)
    required: true
  },
  moisture: {
    type: Number, // Percentage (%)
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SoilRecord', SoilRecordSchema);
