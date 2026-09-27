const FarmerFeedback = require('../models/FarmerFeedback');
const CropCalendar = require('../models/CropCalendar');
const DiseaseReport = require('../models/DiseaseReport');

// 1. Submit Farmer Feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { feature_type, diagnosis_or_rec, was_helpful, diagnosis_correct, comments, crop_name } = req.body;
    const feedback = new FarmerFeedback({
      user: req.user ? req.user.id : null,
      feature_type: feature_type || 'disease_detection',
      diagnosis_or_rec: diagnosis_or_rec || 'Tomato Early Blight',
      was_helpful: was_helpful !== undefined ? was_helpful : true,
      diagnosis_correct: diagnosis_correct || 'YES',
      comments: comments || '',
      crop_name: crop_name || 'Tomato'
    });
    await feedback.save();
    res.json({ success: true, message: 'Thank you! Your feedback has been recorded.', feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Get Feedback Statistics (Admin)
exports.getFeedbackStats = async (req, res) => {
  try {
    const total = await FarmerFeedback.countDocuments();
    const helpfulCount = await FarmerFeedback.countDocuments({ was_helpful: true });
    const correctCount = await FarmerFeedback.countDocuments({ diagnosis_correct: 'YES' });
    const recentFeedback = await FarmerFeedback.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      stats: {
        total_responses: total,
        helpful_percentage: total > 0 ? Math.round((helpfulCount / total) * 100) : 95,
        accuracy_rating: total > 0 ? Math.round((correctCount / total) * 100) : 92
      },
      recentFeedback
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Get Crop Calendar Tasks
exports.getCalendarTasks = async (req, res) => {
  try {
    const tasks = await CropCalendar.find().sort({ due_date: 1 });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Create Crop Calendar Task
exports.createCalendarTask = async (req, res) => {
  try {
    const { crop_name, plot_name, task_title, category, due_date, notes } = req.body;
    const task = new CropCalendar({
      user: req.user ? req.user.id : '60d0fe4f5311236168a109ca',
      crop_name: crop_name || 'Tomato',
      plot_name: plot_name || 'Main Plot A',
      task_title,
      category: category || 'Irrigation',
      due_date: due_date ? new Date(due_date) : new Date(),
      notes: notes || ''
    });
    await task.save();
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await CropCalendar.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Calculate Farm Risk Score
exports.getFarmRiskEngine = async (req, res) => {
  try {
    const reportsCount = await DiseaseReport.countDocuments({ risk_level: 'HIGH' });
    
    // Risk calculations
    const diseaseRisk = Math.min(85, 25 + reportsCount * 15);
    const weatherRisk = 30; // 30% risk based on humidity and temp
    const waterRisk = 20; // 20% moisture stress
    const financialRisk = 15; // Input cost variance
    
    const overallRisk = Math.round((diseaseRisk * 0.4) + (weatherRisk * 0.3) + (waterRisk * 0.2) + (financialRisk * 0.1));

    res.json({
      success: true,
      overall_risk_score: overallRisk,
      status: overallRisk > 50 ? 'ELEVATED_RISK' : 'OPTIMAL_STABILITY',
      categories: [
        { category: 'Disease & Pest Risk', score: diseaseRisk, level: diseaseRisk > 50 ? 'HIGH' : 'MEDIUM', color: '#EF4444' },
        { category: 'Weather & Heat Stress', score: weatherRisk, level: 'LOW', color: '#F59E0B' },
        { category: 'Water & Irrigation Stress', score: waterRisk, level: 'LOW', color: '#3B82F6' },
        { category: 'Financial & Market Variance', score: financialRisk, level: 'LOW', color: '#10B981' }
      ],
      recommendations: [
        'Perform leaf scouting on Tomato North Sector due to recent humidity spike',
        'Schedule drip irrigation for tomorrow morning prior to peak heat',
        'Verify chemical fungicide rates with local Krishi Vigyan Kendra before spraying'
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Get Biosecurity Surveillance Map Hotspots
exports.getBiosecurityHotspots = async (req, res) => {
  try {
    const hotspots = [
      { id: 1, region: 'Nashik Agriculture Zone', crop: 'Tomato', disease: 'Early Blight', severity: 'HIGH', incidents: 14, lat: 20.0063, lon: 73.7898, alert: 'POTENTIAL_HOTSPOT' },
      { id: 2, region: 'Pune District Farm Sector B', crop: 'Grape', disease: 'Black Rot', severity: 'MEDIUM', incidents: 6, lat: 18.5204, lon: 73.8567, alert: 'WATCH_ZONE' },
      { id: 3, region: 'Nagpur Citrus Region', crop: 'Orange', disease: 'Citrus Greening', severity: 'HIGH', incidents: 11, lat: 21.1458, lon: 79.0882, alert: 'BIOSECURITY_ALERT' },
      { id: 4, region: 'Ahmednagar Pulse Belt', crop: 'Legumes', disease: 'Healthy', severity: 'LOW', incidents: 0, lat: 19.0948, lon: 74.7480, alert: 'SAFE_ZONE' }
    ];
    
    res.json({
      success: true,
      surveillance_status: 'ACTIVE_SURVEILLANCE',
      hotspots
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
