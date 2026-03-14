const User = require('../models/User');

const calculateMatchScore = (currentUser, targetUser) => {
  let score = 0;
  
  // 1. Skill Compatibility (40%)
  const hasSkillOverlap = targetUser.skillsTeach.some(s => currentUser.skillsLearn.includes(s));
  const theyWantMySkill = currentUser.skillsTeach.some(s => targetUser.skillsLearn.includes(s));
  if (hasSkillOverlap) score += 40;
  else if (theyWantMySkill) score += 20;

  // 2. Availability Overlap (20%)
  if (currentUser.availability === targetUser.availability) score += 20;

  // 3. Location Proximity (20%)
  if (currentUser.location === targetUser.location) score += 20;

  // 4. User Reviews (10%)
  score += (targetUser.rating / 5) * 10;

  // 5. New User Boost (10%)
  const daysSinceCreated = (new Date() - targetUser.createdAt) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 7) score += 10;

  return score;
};

// @desc    Get recommended matches
// @route   GET /api/matches
const getRecommendedMatches = async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } });
    const scoredMatches = allUsers.map(u => {
      const userObj = u.toObject();
      userObj.matchScore = calculateMatchScore(req.user, u);
      return userObj;
    }).sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(scoredMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedMatches };
