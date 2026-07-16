const GovernmentScheme = require('../models/GovernmentScheme');

// @desc    Get all government schemes
// @route   GET /api/schemes
// @access  Private
const getSchemes = async (req, res) => {
  try {
    const schemes = await GovernmentScheme.find({});
    res.json({ success: true, count: schemes.length, data: schemes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check eligibility of the current logged-in farmer
// @route   POST /api/schemes/check-eligibility
// @access  Private
const checkEligibility = async (req, res) => {
  try {
    const farmer = req.user;
    if (!farmer || !farmer.profile) {
      return res.status(400).json({ success: false, message: 'Farmer profile is incomplete' });
    }

    const schemes = await GovernmentScheme.find({});
    const eligibilityResults = [];

    schemes.forEach(scheme => {
      let isEligible = true;
      const reasons = [];

      const { minAge, maxAge, maxFarmSize, states, soilTypes } = scheme.eligibility;

      // Age Check
      if (farmer.profile.age) {
        if (farmer.profile.age < minAge) {
          isEligible = false;
          reasons.push(`Minimum age required is ${minAge}. Farmer is ${farmer.profile.age} years old.`);
        }
        if (maxAge && farmer.profile.age > maxAge) {
          isEligible = false;
          reasons.push(`Maximum age limit is ${maxAge}. Farmer is ${farmer.profile.age} years old.`);
        }
      }

      // Farm Size Check
      if (maxFarmSize && farmer.profile.farmSize) {
        if (farmer.profile.farmSize > maxFarmSize) {
          isEligible = false;
          reasons.push(`Maximum farm size limit is ${maxFarmSize} acres. Farmer owns ${farmer.profile.farmSize} acres.`);
        }
      }

      // State Check
      if (states && states.length > 0 && farmer.profile.state) {
        const stateMatch = states.some(s => s.toLowerCase() === farmer.profile.state.toLowerCase());
        if (!stateMatch) {
          isEligible = false;
          reasons.push(`Scheme is only active in: ${states.join(', ')}. Farmer lives in ${farmer.profile.state}.`);
        }
      }

      // Soil Type Check
      if (soilTypes && soilTypes.length > 0 && farmer.profile.soilType) {
        const soilMatch = soilTypes.some(s => s.toLowerCase() === farmer.profile.soilType.toLowerCase());
        if (!soilMatch) {
          isEligible = false;
          reasons.push(`Scheme is customized for: ${soilTypes.join(', ')} soil types. Farmer has ${farmer.profile.soilType}.`);
        }
      }

      eligibilityResults.push({
        schemeId: scheme._id,
        title: scheme.title,
        department: scheme.department,
        benefit: scheme.benefit,
        link: scheme.link,
        isEligible,
        reasons: isEligible ? ['Farmer profile meets all requirements.'] : reasons
      });
    });

    res.json({ success: true, data: eligibilityResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSchemes,
  checkEligibility
};
