const express = require('express');
const router = express.Router();
const { completeProfile } = require('../controllers/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/complete', verifyToken, completeProfile);

module.exports = router;