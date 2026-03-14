const User = require('../models/User');

const calculateOracleMatch = (userA, userB) => {
  let score = 0;
  let explanations = [];

  // 1. Skill Compatibility (40%) - Direct complementary skills
  const teachToLearn = userB.skillsTeach.some(s => userA.skillsLearn.includes(s));
  const learnToTeach = userA.skillsTeach.some(s => userB.skillsLearn.includes(s));
  
  if (teachToLearn && learnToTeach) {
    score += 40;
    explanations.push("Perfect Mutual Skill Swap");
  } else if (teachToLearn || learnToTeach) {
    score += 25;
    explanations.push("One-way Skill Match");
  }

  // 2. Learning Interest Overlap (20%) - Both want to learn the same thing (study buddies)
  const sharedInterests = userA.skillsLearn.filter(s => userB.skillsLearn.includes(s));
  if (sharedInterests.length > 0) {
    score += 20;
    explanations.push("Shared Learning Goals");
  }

  // 3. Availability Match (15%)
  if (userA.availability === userB.availability) {
    score += 15;
    explanations.push("Matching Schedules");
  }

  // 4. Location Proximity (10%)
  if (userA.location === userB.location) {
    score += 10;
    explanations.push("Same Location");
  }

  // 5. User Ratings (10%)
  const ratingWeight = (userB.rating / 5) * 10;
  score += ratingWeight;
  if (userB.rating >= 4.5) explanations.push("Top Rated Teacher");

  // 6. New User Boost (5%)
  const daysSinceCreated = (new Date() - userB.createdAt) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 7) {
    score += 5;
    explanations.push("Fast Rising New Talent");
  }

  return { 
    score: Math.min(Math.round(score), 100), 
    explanations 
  };
};

const getOracleMatches = async (req, res) => {
  try {
    const currentUser = req.user;
    const potentialMatches = await User.find({ _id: { $ne: currentUser._id } });

    const rankedMatches = potentialMatches.map(user => {
      const { score, explanations } = calculateOracleMatch(currentUser, user);
      return {
        ...user.toObject(),
        compatibilityScore: score,
        matchExplanations: explanations
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(rankedMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOracleMatches };
