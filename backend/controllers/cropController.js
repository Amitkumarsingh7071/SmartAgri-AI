const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// @desc    Get all crops of logged in user
// @route   GET /api/crops
// @access  Private
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user._id }).populate('farmId', 'name location');
    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user._id }).populate('farmId', 'name location');
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found or unauthorized' });
    }
    res.json({ success: true, data: crop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new crop
// @route   POST /api/crops
// @access  Private
const createCrop = async (req, res) => {
  try {
    const { farmId, name, variety, stage, plantedDate, expectedHarvestDate } = req.body;

    // Verify farm belongs to user
    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Associated farm not found or unauthorized' });
    }

    const currentStage = stage || 'Sowing';
    const crop = await Crop.create({
      userId: req.user._id,
      farmId,
      name,
      variety,
      stage: currentStage,
      plantedDate: plantedDate || Date.now(),
      expectedHarvestDate,
      history: [{ stage: currentStage, date: plantedDate || Date.now(), notes: 'Crop planted and registered.' }]
    });

    // Update current crop on Farm
    farm.currentCrop = name;
    farm.expectedHarvestDate = expectedHarvestDate;
    await farm.save();

    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop (stages, dates, etc.)
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findOne({ _id: req.params.id, userId: req.user._id });
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found or unauthorized' });
    }

    const { name, variety, stage, expectedHarvestDate, harvestDate, notes } = req.body;

    if (name) crop.name = name;
    if (variety) crop.variety = variety;
    if (expectedHarvestDate) crop.expectedHarvestDate = expectedHarvestDate;
    
    if (stage && stage !== crop.stage) {
      crop.stage = stage;
      // Push new stage to history log
      crop.history.push({
        stage,
        date: Date.now(),
        notes: notes || `Stage updated to ${stage}`
      });

      if (stage === 'Harvested') {
        crop.harvestDate = harvestDate || Date.now();
        // Clear current crop on associated farm
        await Farm.findByIdAndUpdate(crop.farmId, {
          previousCrop: crop.name,
          currentCrop: '',
          expectedHarvestDate: null
        });
      }
    }

    const updatedCrop = await crop.save();
    res.json({ success: true, data: updatedCrop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found or unauthorized' });
    }

    // Clean up farm status if matching this crop
    const farm = await Farm.findOne({ _id: crop.farmId, userId: req.user._id });
    if (farm && farm.currentCrop === crop.name) {
      farm.currentCrop = '';
      farm.expectedHarvestDate = null;
      await farm.save();
    }

    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop
};
