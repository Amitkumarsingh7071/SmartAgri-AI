const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'Seeds',
      'Fertilizers',
      'Labour',
      'Water',
      'Electricity',
      'Transport',
      'Equipment',
      'Market Sale',
      'Subsidy',
      'Other'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  crop: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Finance', FinanceSchema);
