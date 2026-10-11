const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  shift: { 
    type: String, 
    enum: ['Shift A', 'Shift B', 'Shift C'], 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Pickup', 'Drop', 'Both'], 
    required: true 
  },
  bookingDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    default: 'Confirmed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);