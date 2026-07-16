const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'admin'],
    default: 'farmer'
  },
  profile: {
    name: { type: String, required: true },
    age: { type: Number },
    phone: { type: String, required: true },
    address: { type: String },
    village: { type: String },
    district: { type: String },
    state: { type: String },
    farmerId: { type: String, unique: true },
    farmSize: { type: Number }, // in acres
    soilType: { type: String },
    irrigationType: { type: String },
    experience: { type: Number }, // in years
    photoUrl: { type: String },
    qrCode: { type: String } // Base64 data URI of QR code
  }
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
