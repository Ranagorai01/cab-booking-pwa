const Booking = require('../models/Booking');
const moment = require('moment-timezone');

const createBooking = async (req, res) => {
  const { shift, type } = req.body;

  if (!shift || !type) {
    return res.status(400).json({ error: 'Shift and booking type are strictly required.' });
  }

  const currentTime = moment().tz("Asia/Calcutta");
  const currentHour = currentTime.hour();

  // 18 represents 6:00 PM in 24-hour format. 
  // If the hour is 18 or greater, the portal is closed.
  if (currentHour >= 18) {
    return res.status(403).json({ 
      error: 'Booking portal is closed. Bookings are only accepted before 6:00 PM.' 
    });
  }

  try {
    const todayStart = currentTime.clone().startOf('day').toDate();
    const todayEnd = currentTime.clone().endOf('day').toDate();

    // Prevent duplicate daily bookings
    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      bookingDate: { $gte: todayStart, $lte: todayEnd }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'A booking already exists for your account today.' });
    }

    const newBooking = new Booking({
      userId: req.user.id,
      shift,
      type,
      bookingDate: currentTime.toDate()
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking confirmed.' });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ error: 'Server error during booking.' });
  }
};

const checkPortalStatus = (req, res) => {
  const currentTime = moment().tz("Asia/Calcutta");
  const currentHour = currentTime.hour();
  
  const isOpen = currentHour < 18;
  res.status(200).json({ isOpen });
};

module.exports = { createBooking, checkPortalStatus };