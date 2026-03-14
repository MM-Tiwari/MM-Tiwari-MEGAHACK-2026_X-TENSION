const express = require('express');
const router = express.Router();
const { sendRequest, getRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRequests).post(protect, sendRequest);
router.post('/:id/status', protect, updateRequestStatus);

module.exports = router;
