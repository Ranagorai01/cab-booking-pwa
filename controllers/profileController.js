const User = require('../models/User');
const bcrypt = require('bcryptjs');

const completeProfile = async (req, res) => {
  const { password, fullName, location, contactNumber, emergencyContact, teamName } = req.body;

  if (!password || !fullName || !location || !contactNumber || !emergencyContact || !teamName) {
    return res.status(400).json({ error: 'All fields are strictly mandatory.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: hashedPassword,
        fullName,
        location,
        contactNumber,
        emergencyContact,
        teamName,
        profileCompleted: true
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User record not found.' });
    }

    res.status(200).json({ message: 'Profile completed successfully.' });
  } catch (error) {
    console.error('Profile Completion Error:', error);
    res.status(500).json({ error: 'Server error during profile completion.' });
  }
};

module.exports = { completeProfile };