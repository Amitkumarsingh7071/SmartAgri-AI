const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { generateQR } = require('../utils/qrCodeGenerator');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password, role, name, age, phone, address, village, district, state, farmerId, farmSize, soilType, irrigationType, experience } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Generate unique farmer ID if not provided
    const finalFarmerId = farmerId || `FAR-${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate QR Code containing profile metadata
    const qrData = JSON.stringify({
      id: finalFarmerId,
      name,
      phone,
      village,
      role: role || 'farmer'
    });
    const qrCode = await generateQR(qrData);

    const user = await User.create({
      email,
      password,
      role: role || 'farmer',
      profile: {
        name,
        age,
        phone,
        address,
        village,
        district,
        state,
        farmerId: finalFarmerId,
        farmSize,
        soilType,
        irrigationType,
        experience,
        qrCode,
        photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}` // Default avatar generator
      }
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.profile.name = req.body.name || user.profile.name;
      user.profile.age = req.body.age !== undefined ? req.body.age : user.profile.age;
      user.profile.phone = req.body.phone || user.profile.phone;
      user.profile.address = req.body.address || user.profile.address;
      user.profile.village = req.body.village || user.profile.village;
      user.profile.district = req.body.district || user.profile.district;
      user.profile.state = req.body.state || user.profile.state;
      user.profile.farmSize = req.body.farmSize !== undefined ? req.body.farmSize : user.profile.farmSize;
      user.profile.soilType = req.body.soilType || user.profile.soilType;
      user.profile.irrigationType = req.body.irrigationType || user.profile.irrigationType;
      user.profile.experience = req.body.experience !== undefined ? req.body.experience : user.profile.experience;
      user.profile.photoUrl = req.body.photoUrl || user.profile.photoUrl;

      // Re-generate QR Code if info changed
      const qrData = JSON.stringify({
        id: user.profile.farmerId,
        name: user.profile.name,
        phone: user.profile.phone,
        village: user.profile.village,
        role: user.role
      });
      user.profile.qrCode = await generateQR(qrData);

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await User.create(user); // Triggers save middleware

      res.json({
        success: true,
        _id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password mock
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email does not exist' });
    }
    
    // Simulate email reset code
    res.json({
      success: true,
      message: 'Password reset link sent to registered email address (Simulated)',
      resetToken: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword
};
