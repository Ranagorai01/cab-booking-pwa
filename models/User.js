const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Only Gmail addresses are permitted.']
  },
  password: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  fullName: { type: String },
  location: { type: String },
  contactNumber: { type: String },
  emergencyContact: { type: String },
  teamName: { type: String },
  profileCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);