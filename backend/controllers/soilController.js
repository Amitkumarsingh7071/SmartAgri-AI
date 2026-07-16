const SoilRecord = require('../models/SoilRecord');
const Farm = require('../models/Farm');
const User = require('../models/User');
const { generateSoilHealthPDF } = require('../utils/pdfGenerator');

// @desc    Get all soil records of user
// @route   GET /api/soil
// @access  Private
const getSoilRecords = async (req, res) => {
  try {
    const records = await SoilRecord.find({ userId: req.user._id }).populate('farmId', 'name location');
    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get soil record by ID
// @route   GET /api/soil/:id
// @access  Private
const getSoilRecordById = async (req, res) => {
  try {
    const record = await SoilRecord.findOne({ _id: req.params.id, userId: req.user._id }).populate('farmId', 'name location');
    if (!record) {
      return res.status(404).json({ success: false, message: 'Soil record not found or unauthorized' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log a new soil record
// @route   POST /api/soil
// @access  Private
const createSoilRecord = async (req, res) => {
  try {
    const { farmId, N, P, K, pH, organicCarbon, moisture } = req.body;

    // Verify farm ownership
    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Associated farm not found or unauthorized' });
    }

    const record = await SoilRecord.create({
      userId: req.user._id,
      farmId,
      N: Number(N),
      P: Number(P),
      K: Number(K),
      pH: Number(pH),
      organicCarbon: Number(organicCarbon),
      moisture: Number(moisture)
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a soil record
// @route   DELETE /api/soil/:id
// @access  Private
const deleteSoilRecord = async (req, res) => {
  try {
    const record = await SoilRecord.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Soil record not found or unauthorized' });
    }
    res.json({ success: true, message: 'Soil record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download PDF Soil Health Card
// @route   GET /api/soil/:id/card
// @access  Private
const downloadSoilCardPDF = async (req, res) => {
  try {
    const record = await SoilRecord.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Soil record not found or unauthorized' });
    }

    const farm = await Farm.findById(record.farmId);
    const farmer = await User.findById(req.user._id);

    if (!farm || !farmer) {
      return res.status(404).json({ success: false, message: 'Associated farmer or farm profile missing' });
    }

    // Set Response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Soil_Health_Card_${record._id.toString().substring(0, 8).toUpperCase()}.pdf`);

    // Stream the PDF
    generateSoilHealthPDF(res, farmer, farm, record);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = {
  getSoilRecords,
  getSoilRecordById,
  createSoilRecord,
  deleteSoilRecord,
  downloadSoilCardPDF
};
