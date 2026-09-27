const mongoose = require('mongoose');

const cropCalendarSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop_name: {
    type: String,
    required: true
  },
  plot_name: {
    type: String,
    default: 'Main Field'
  },
  task_title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Sowing', 'Irrigation', 'Nutrient', 'Scouting', 'Pesticide', 'Harvest'],
    default: 'Irrigation'
  },
  due_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['TODAY', 'UPCOMING', 'COMPLETED', 'OVERDUE'],
    default: 'UPCOMING'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CropCalendar', cropCalendarSchema);
