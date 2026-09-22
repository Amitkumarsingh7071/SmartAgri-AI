const mongoose = require('mongoose');

const InsuranceClaimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  cropName: {
    type: String,
    required: true,
    default: 'Tomato'
  },
  damageReason: {
    type: String,
    enum: ['HEAVY_RAIN', 'FLOOD', 'DISEASE', 'DROUGHT', 'HAILSTORM'],
    required: true
  },
  damagedAreaAcres: {
    type: Number,
    required: true,
    default: 1.5
  },
  estimatedLossAmount: {
    type: Number,
    required: true
  },
  claimStatus: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Inspection', 'Approved'],
    default: 'Submitted'
  },
  policyNumber: {
    type: String,
    default: function() {
      return 'PMFBY-' + Math.floor(100000 + Math.random() * 900000);
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InsuranceClaim', InsuranceClaimSchema);
