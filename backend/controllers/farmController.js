const Farm = require('../models/Farm');

// @desc    Get all farms of logged in user
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id });
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single farm
// @route   GET /api/farms/:id
// @access  Private
const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found or unauthorized' });
    }
    res.json({ success: true, data: farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res) => {
  try {
    const { name, location, latitude, longitude, area, soilType, waterSource, previousCrop, currentCrop, expectedHarvestDate } = req.body;

    const farm = await Farm.create({
      userId: req.user._id,
      name,
      location,
      latitude: Number(latitude) || 28.6139, // Default coordinates (e.g. New Delhi) if not provided
      longitude: Number(longitude) || 77.2090,
      area: Number(area),
      soilType,
      waterSource,
      previousCrop,
      currentCrop,
      expectedHarvestDate
    });

    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
  try {
    let farm = await Farm.findOne({ _id: req.params.id, userId: req.user._id });

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found or unauthorized' });
    }

    const fieldsToUpdate = [
      'name', 'location', 'latitude', 'longitude', 'area', 
      'soilType', 'waterSource', 'previousCrop', 'currentCrop', 'expectedHarvestDate'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'latitude' || field === 'longitude' || field === 'area') {
          farm[field] = Number(req.body[field]);
        } else {
          farm[field] = req.body[field];
        }
      }
    });

    const updatedFarm = await farm.save();
    res.json({ success: true, data: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found or unauthorized' });
    }

    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm
};
