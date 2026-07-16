const mongoose = require('mongoose');

const GrowthStageHistorySchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvested'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

const CropSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true
  },
  variety: {
    type: String
  },
  stage: {
    type: String,
    enum: ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvested'],
    default: 'Sowing'
  },
  plantedDate: {
    type: Date,
    default: Date.now
  },
  expectedHarvestDate: {
    type: Date
  },
  harvestDate: {
    type: Date
  },
  history: [GrowthStageHistorySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', CropSchema);
