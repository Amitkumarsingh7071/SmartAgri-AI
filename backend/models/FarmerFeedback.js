const mongoose = require('mongoose');

const farmerFeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  feature_type: {
    type: String,
    enum: ['disease_detection', 'crop_recommendation', 'fertilizer_recommendation', 'weather_alert', 'voice_assistant'],
    default: 'disease_detection'
  },
  diagnosis_or_rec: {
    type: String,
    required: true
  },
  was_helpful: {
    type: Boolean,
    required: true
  },
  diagnosis_correct: {
    type: String,
    enum: ['YES', 'NO', 'UNSURE'],
    default: 'YES'
  },
  comments: {
    type: String,
    default: ''
  },
  crop_name: {
    type: String,
    default: 'Tomato'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FarmerFeedback', farmerFeedbackSchema);
