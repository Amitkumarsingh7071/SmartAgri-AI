const DiseaseReport = require('../models/DiseaseReport');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Notification = require('../models/Notification');

// Standard 7-day treatment timeline generator based on disease & severity
const generateTreatmentPlan = (diseaseName, severity) => {
  const isHealthy = diseaseName.toLowerCase().includes('healthy');

  if (isHealthy) {
    return [
      { day: 'TODAY', task: 'No treatment required. Scout leaves for early spot signs.', completed: true },
      { day: 'DAY 3', task: 'Check soil moisture levels and ensure balanced drip irrigation.', completed: false },
      { day: 'DAY 7', task: 'Apply organic compost dressing during regular feeding schedule.', completed: false }
    ];
  }

  return [
    { day: 'TODAY', task: 'Remove severely infected lower leaves and dispose away from farm field.', completed: false },
    { day: 'DAY 2', task: 'Inspect nearby plants for yellow halos or leaf spot symptoms.', completed: false },
    { day: 'DAY 3', task: 'Upload a follow-up image to compare leaf progression.', completed: false },
    { day: 'DAY 5', task: 'Check whether lesion expansion has halted after preventative care.', completed: false },
    { day: 'DAY 7', task: 'Review disease recovery progress and update status.', completed: false }
  ];
};

// @desc    Create Disease Report & Treatment Plan
// @route   POST /api/disease/report
// @access  Private
const createDiseaseReport = async (req, res) => {
  try {
    const {
      farmId,
      cropName = 'Tomato',
      imageUrl,
      diseaseName,
      confidence,
      severity = 'Moderate',
      riskLevel = 'MEDIUM',
      immediateActions = []
    } = req.body;

    if (!diseaseName || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Disease name and image URL are required.' });
    }

    const treatmentPlan = generateTreatmentPlan(diseaseName, severity);

    const report = await DiseaseReport.create({
      userId: req.user._id,
      farmId: farmId || null,
      cropName,
      imageUrl,
      diseaseName,
      confidence: Number(confidence) || 90.0,
      severity,
      riskLevel,
      immediateActions: immediateActions.length > 0 ? immediateActions : [
        'Remove severely infected leaves',
        'Improve canopy air circulation',
        'Avoid overhead irrigation to keep leaves dry',
        'Inspect surrounding crops'
      ],
      treatmentPlan,
      status: diseaseName.toLowerCase().includes('healthy') ? 'Resolved' : 'Monitoring'
    });

    // Notify farmer if risk is HIGH or CRITICAL
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      await Notification.create({
        userId: req.user._id,
        title: `🐛 Disease Alert: ${diseaseName}`,
        message: `${severity} infection risk detected on ${cropName}. Treatment timeline generated.`,
        type: 'general'
      });
    }

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('createDiseaseReport error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Disease Reports for Logged-In Farmer
// @route   GET /api/disease/reports
// @access  Private
const getDiseaseReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ userId: req.user._id })
      .populate('farmId', 'name location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('getDiseaseReports error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Disease Report Details
// @route   GET /api/disease/reports/:id
// @access  Private
const getDiseaseReportById = async (req, res) => {
  try {
    const report = await DiseaseReport.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('farmId', 'name location');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Disease report not found.' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('getDiseaseReportById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Treatment Step Status
// @route   PUT /api/disease/reports/:id/step
// @access  Private
const updateTreatmentStep = async (req, res) => {
  try {
    const { stepIndex, completed } = req.body;
    const report = await DiseaseReport.findOne({ _id: req.params.id, userId: req.user._id });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    if (report.treatmentPlan[stepIndex]) {
      report.treatmentPlan[stepIndex].completed = completed;
      
      // Check if all steps are done
      const allDone = report.treatmentPlan.every(s => s.completed);
      if (allDone) {
        report.status = 'Resolved';
      }

      await report.save();
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('updateTreatmentStep error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload & Compare Follow-Up Image
// @route   POST /api/disease/compare
// @access  Private
const addFollowUpComparison = async (req, res) => {
  try {
    const { reportId, followUpImageUrl, newDiseaseName, newConfidence, newSeverity, notes } = req.body;

    const originalReport = await DiseaseReport.findOne({ _id: reportId, userId: req.user._id });
    if (!originalReport) {
      return res.status(404).json({ success: false, message: 'Original disease report not found.' });
    }

    // Determine progression status accurately
    const isNewHealthy = newDiseaseName.toLowerCase().includes('healthy');
    const isOldHealthy = originalReport.diseaseName.toLowerCase().includes('healthy');

    let progressionStatus = 'UNCHANGED';

    if (isNewHealthy && !isOldHealthy) {
      progressionStatus = 'IMPROVED';
    } else if (!isNewHealthy && isOldHealthy) {
      progressionStatus = 'WORSENING';
    } else {
      // Compare severity levels: Mild < Moderate < Severe
      const severityOrder = { Mild: 1, Moderate: 2, Severe: 3 };
      const oldRank = severityOrder[originalReport.severity] || 2;
      const newRank = severityOrder[newSeverity] || 2;

      if (newRank < oldRank) {
        progressionStatus = 'IMPROVED';
      } else if (newRank > oldRank) {
        progressionStatus = 'WORSENING';
      } else {
        progressionStatus = 'UNCHANGED';
      }
    }

    // Add follow-up record
    const followUpEntry = {
      imageUrl: followUpImageUrl,
      diseaseName: newDiseaseName,
      confidence: Number(newConfidence) || 90.0,
      severity: newSeverity || 'Moderate',
      progressionStatus,
      notes: notes || `Follow-up comparison result: ${progressionStatus}`,
      date: new Date()
    };

    originalReport.followUpReports.push(followUpEntry);

    // Update main report status
    if (progressionStatus === 'IMPROVED') {
      originalReport.status = isNewHealthy ? 'Resolved' : 'Monitoring';
    } else if (progressionStatus === 'WORSENING') {
      originalReport.status = 'Worsening';
    }

    await originalReport.save();

    res.json({
      success: true,
      progressionStatus,
      message: progressionStatus === 'IMPROVED'
        ? '✅ Crop condition appears improved!'
        : progressionStatus === 'WORSENING'
        ? '⚠️ Disease Risk Increasing. Consider consulting a local agricultural officer (KVK).'
        : 'ℹ️ Crop condition remains unchanged.',
      data: originalReport
    });
  } catch (error) {
    console.error('addFollowUpComparison error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDiseaseReport,
  getDiseaseReports,
  getDiseaseReportById,
  updateTreatmentStep,
  addFollowUpComparison
};
