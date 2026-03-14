const MatchRequest = require('../models/User'); // Actually User for credits update
const Request = require('../models/MatchRequest');
const User = require('../models/User');

// @desc    Send a skill exchange request
// @route   POST /api/requests
const sendRequest = async (req, res) => {
  const { receiverId, skillRequested } = req.body;
  if (req.user.credits < 1) return res.status(400).json({ message: 'Insufficient credits' });
  
  try {
    const request = await Request.create({
      sender: req.user._id,
      receiver: receiverId,
      skillRequested
    });
    
    req.user.credits -= 1;
    await req.user.save();
    
    res.status(201).json({ message: 'Request sent', credits: req.user.credits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all requests (sent and received)
// @route   GET /api/requests
const getRequests = async (req, res) => {
  const received = await Request.find({ receiver: req.user._id }).populate('sender', 'username rating skillLevel');
  const sent = await Request.find({ sender: req.user._id }).populate('receiver', 'username rating skillLevel');
  res.json({ received, sent });
};

// @desc    Update request status
// @route   POST /api/requests/:id/status
const updateRequestStatus = async (req, res) => {
  const { status, scheduledDate } = req.body;
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  request.status = status;
  if (scheduledDate) request.scheduledDate = scheduledDate;
  await request.save();
  
  if (status === 'completed') {
    const teacher = await User.findById(request.receiver);
    teacher.credits += 2;
    teacher.completedSessions += 1;
    await teacher.save();
  }
  
  res.json(request);
};

module.exports = { sendRequest, getRequests, updateRequestStatus };
