const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilRecord = require('../models/SoilRecord');
const Finance = require('../models/Finance');
const Notification = require('../models/Notification');
const GovernmentScheme = require('../models/GovernmentScheme');
const MandiPrice = require('../models/MandiPrice');
const { exportCSV } = require('../utils/csvGenerator');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalFarms = await Farm.countDocuments({});
    const totalCrops = await Crop.countDocuments({});
    
    // Total farms area
    const farms = await Farm.find({});
    const totalArea = farms.reduce((acc, f) => acc + (f.area || 0), 0);

    // Crop distribution by stage
    const crops = await Crop.find({});
    const stages = { Sowing: 0, Vegetative: 0, Flowering: 0, Maturity: 0, Harvested: 0 };
    crops.forEach(c => {
      if (stages[c.stage] !== undefined) {
        stages[c.stage]++;
      }
    });

    // Financial calculations
    const finances = await Finance.find({});
    let systemRevenue = 0;
    let systemExpenses = 0;
    finances.forEach(f => {
      if (f.type === 'income') systemRevenue += f.amount;
      else systemExpenses += f.amount;
    });

    // Soil metrics averages
    const soilRecords = await SoilRecord.find({});
    let avgN = 0, avgP = 0, avgK = 0, avgPH = 0;
    if (soilRecords.length > 0) {
      soilRecords.forEach(s => {
        avgN += s.N;
        avgP += s.P;
        avgK += s.K;
        avgPH += s.pH;
      });
      avgN = (avgN / soilRecords.length).toFixed(1);
      avgP = (avgP / soilRecords.length).toFixed(1);
      avgK = (avgK / soilRecords.length).toFixed(1);
      avgPH = (avgPH / soilRecords.length).toFixed(2);
    }

    res.json({
      success: true,
      data: {
        counters: {
          totalFarmers,
          totalFarms,
          totalCrops,
          totalArea: totalArea.toFixed(1)
        },
        cropStages: stages,
        finances: {
          revenue: systemRevenue,
          expenses: systemExpenses,
          profit: systemRevenue - systemExpenses
        },
        soilAverages: { N: Number(avgN), P: Number(avgP), K: Number(avgK), pH: Number(avgPH) }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    List all farmers
// @route   GET /api/admin/farmers
// @access  Private/Admin
const getFarmersList = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json({ success: true, count: farmers.length, data: farmers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Broadcast a notification to all farmers or specific farmer
// @route   POST /api/admin/notifications
// @access  Private/Admin
const broadcastNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;

    const notification = await Notification.create({
      userId: userId || null, // null for broadcast
      title,
      message,
      type: type || 'general'
    });

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a Government Scheme
// @route   POST /api/admin/schemes
// @access  Private/Admin
const createScheme = async (req, res) => {
  try {
    const { title, description, department, benefit, minAge, maxAge, maxFarmSize, states, soilTypes, link } = req.body;

    const scheme = await GovernmentScheme.create({
      title,
      description,
      department,
      benefit,
      eligibility: {
        minAge: Number(minAge) || 18,
        maxAge: Number(maxAge) || 100,
        maxFarmSize: maxFarmSize ? Number(maxFarmSize) : undefined,
        states: states || [],
        soilTypes: soilTypes || []
      },
      link
    });

    res.status(201).json({ success: true, data: scheme });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update Mandi Price
// @route   POST /api/admin/prices
// @access  Private/Admin
const updateMandiPrice = async (req, res) => {
  try {
    const { crop, market, price, state } = req.body;

    const newPrice = await MandiPrice.create({
      crop,
      market,
      price: Number(price),
      state,
      date: Date.now()
    });

    res.status(201).json({ success: true, data: newPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Farmer Report (CSV)
// @route   GET /api/admin/reports/farmers
// @access  Private/Admin
const exportFarmersCSV = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' });
    const fields = [
      { label: 'Farmer ID', value: 'profile.farmerId' },
      { label: 'Name', value: 'profile.name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'profile.phone' },
      { label: 'Age', value: 'profile.age' },
      { label: 'Village', value: 'profile.village' },
      { label: 'District', value: 'profile.district' },
      { label: 'State', value: 'profile.state' },
      { label: 'Farm Size (Acres)', value: 'profile.farmSize' },
      { label: 'Soil Type', value: 'profile.soilType' },
      { label: 'Irrigation Type', value: 'profile.irrigationType' },
      { label: 'Experience (Years)', value: 'profile.experience' }
    ];
    exportCSV(res, fields, farmers, 'Farmers_Report.csv');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Farms Report (CSV)
// @route   GET /api/admin/reports/farms
// @access  Private/Admin
const exportFarmsCSV = async (req, res) => {
  try {
    const farms = await Farm.find({}).populate('userId', 'profile.name email');
    const fields = [
      { label: 'Farm Name', value: 'name' },
      { label: 'Owner Name', value: 'userId.profile.name' },
      { label: 'Owner Email', value: 'userId.email' },
      { label: 'Location', value: 'location' },
      { label: 'Latitude', value: 'latitude' },
      { label: 'Longitude', value: 'longitude' },
      { label: 'Area (Acres)', value: 'area' },
      { label: 'Soil Type', value: 'soilType' },
      { label: 'Water Source', value: 'waterSource' },
      { label: 'Current Crop', value: 'currentCrop' }
    ];
    exportCSV(res, fields, farms, 'Farms_Report.csv');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Soil Reports (CSV)
// @route   GET /api/admin/reports/soil
// @access  Private/Admin
const exportSoilCSV = async (req, res) => {
  try {
    const soilRecords = await SoilRecord.find({})
      .populate('userId', 'profile.name')
      .populate('farmId', 'name');
      
    const fields = [
      { label: 'Record ID', value: '_id' },
      { label: 'Farmer Name', value: 'userId.profile.name' },
      { label: 'Farm Name', value: 'farmId.name' },
      { label: 'Nitrogen (N)', value: 'N' },
      { label: 'Phosphorus (P)', value: 'P' },
      { label: 'Potassium (K)', value: 'K' },
      { label: 'pH Level', value: 'pH' },
      { label: 'Organic Carbon (%)', value: 'organicCarbon' },
      { label: 'Moisture (%)', value: 'moisture' },
      { label: 'Recorded At', value: 'recordedAt' }
    ];
    exportCSV(res, fields, soilRecords, 'Soil_Diagnostics_Report.csv');
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getFarmersList,
  broadcastNotification,
  createScheme,
  updateMandiPrice,
  exportFarmersCSV,
  exportFarmsCSV,
  exportSoilCSV
};
