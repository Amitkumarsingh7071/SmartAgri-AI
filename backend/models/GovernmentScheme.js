const mongoose = require('mongoose');

const GovernmentSchemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  benefit: {
    type: String,
    required: true // e.g. '₹6,000 per year', '50% Subsidy on Seeds', 'Interest Rate: 4%'
  },
  eligibility: {
    minAge: { type: Number, default: 18 },
    maxAge: { type: Number, default: 100 },
    maxFarmSize: { type: Number }, // in acres (optional)
    soilTypes: [{ type: String }], // optional limits
    states: [{ type: String }] // e.g. ['Punjab', 'Maharashtra'] (empty means nationwide)
  },
  link: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GovernmentScheme', GovernmentSchemeSchema);
