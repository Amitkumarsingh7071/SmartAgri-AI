const mongoose = require('mongoose');

const WeatherAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  crop: {
    type: String,
    default: 'General'
  },
  alertType: {
    type: String,
    enum: ['HEAVY_RAIN', 'HEAT_STRESS', 'IRRIGATION_ADVISORY', 'STRONG_WIND', 'HIGH_HUMIDITY', 'COLD_WAVE', 'GENERAL'],
    required: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recommendedActions: [{
    type: String
  }],
  weatherSnapshot: {
    temp: Number,
    rainProb: Number,
    rainfallMm: Number,
    humidity: Number,
    windSpeed: Number,
    condition: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeatherAlert', WeatherAlertSchema);
