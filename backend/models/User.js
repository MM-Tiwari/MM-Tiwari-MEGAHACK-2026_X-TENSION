const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // New Onboarding Fields
  age: { type: Number },
  bio: { type: String },
  profileImage: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  
  skillsTeach: [{ type: String }],
  skillsLearn: [{ type: String }],
  skillLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Beginner' 
  },
  availability: { 
    type: String, 
    enum: ['Weekdays', 'Weekends', 'Evenings', 'Flexible'],
    default: 'Flexible' 
  },
  
  // System Fields
  rating: { type: Number, default: 5 },
  credits: { type: Number, default: 5 },
  completedSessions: { type: Number, default: 0 },
  onlineStatus: { type: Boolean, default: false },
  onboardingComplete: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
