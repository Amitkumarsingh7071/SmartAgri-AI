const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  diseaseName: { type: String, required: true },
  confidence: { type: Number },
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'] },
  progressionStatus: { type: String, required: true }, // 'IMPROVED' | 'WORSENING' | 'UNCHANGED'
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

const DiseaseReportSchema = new mongoose.Schema({
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
  imageUrl: {
    type: String,
    required: true
  },
  diseaseName: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe'],
    default: 'Moderate'
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  immediateActions: [{
    type: String
  }],
  treatmentPlan: [{
    day: { type: String, required: true }, // e.g. 'TODAY', 'DAY 2', 'DAY 3', 'DAY 5', 'DAY 7'
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  safetyDisclaimer: {
    type: String,
    default: 'Verify all chemical pesticide application rates with a qualified agricultural extension officer (KVK) before spraying.'
  },
  status: {
    type: String,
    enum: ['Active', 'Monitoring', 'Resolved', 'Worsening'],
    default: 'Monitoring'
  },
  followUpReports: [FollowUpSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DiseaseReport', DiseaseReportSchema);
