const express = require('express');
const router = express.Router();
const { createBooking, checkPortalStatus } = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/create', verifyToken, createBooking);
router.get('/status', verifyToken, checkPortalStatus);

module.exports = router;