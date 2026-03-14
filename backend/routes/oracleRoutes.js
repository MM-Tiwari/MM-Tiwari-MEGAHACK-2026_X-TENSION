const express = require('express');
const router = express.Router();
const { getOracleMatches } = require('../controllers/oracleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getOracleMatches);

module.exports = router;
