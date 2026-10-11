const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables BEFORE initializing any routes or services
dotenv.config();

const path = require('path');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const bookingRoutes = require('./routes/booking');
const { scheduleDailyReport } = require('./services/cronService');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/booking', bookingRoutes);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connection established.');
    scheduleDailyReport(); 
    console.log('Automated reporting service initialized.');
  })
  .catch(err => console.error('Database connection failed:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server executing on port ${PORT}`);
});