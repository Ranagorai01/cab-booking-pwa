const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOTP } = require('../services/emailService');
const jwt = require('jsonwebtoken');

const requestOtp = async (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.endsWith('@gmail.com')) {
    return res.status(400).json({ error: 'A valid @gmail.com address is required.' });
  }

  try {
    // Generate a 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    
    // Update existing OTP or insert a new one for this email
    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await sendOTP(email, otpCode);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('OTP Request Error:', error);
    res.status(500).json({ error: 'Failed to process OTP request.' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Check if user exists, otherwise create the base record
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, isEmailVerified: true });
    } else {
      user.isEmailVerified = true;
    }
    await user.save();
    
    // Delete the OTP record so it cannot be reused
    await Otp.deleteOne({ email });

    // Issue a JWT token so the user can proceed to the password/profile creation step
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ 
      message: 'Email verified successfully.', 
      token, 
      profileCompleted: user.profileCompleted 
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'Server error during verification.' });
  }
};

module.exports = { requestOtp, verifyOtp };