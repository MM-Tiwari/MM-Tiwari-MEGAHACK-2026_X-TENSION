const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.skillsTeach = req.body.skillsTeach || user.skillsTeach;
    user.skillsLearn = req.body.skillsLearn || user.skillsLearn;
    user.skillLevel = req.body.skillLevel || user.skillLevel;
    user.availability = req.body.availability || user.availability;
    user.location = req.body.location || user.location;
    user.profileImage = req.body.profileImage || user.profileImage;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.age = req.body.age !== undefined ? req.body.age : user.age;
    user.onboardingComplete = req.body.onboardingComplete !== undefined ? req.body.onboardingComplete : user.onboardingComplete;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUserProfile, updateUserProfile };
