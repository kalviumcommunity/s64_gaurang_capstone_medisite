const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  weight: {
    type: Number
  },
  height: {
    type: Number
  },
  medicalConditions: [{
    type: String
  }],
  healthScore: {
    type: Number,
    default: 80
  },
  healthMetrics: {
    physicalHealth: {
      type: Number,
      default: 80
    },
    mentalWellbeing: {
      type: Number,
      default: 80
    },
    dietQuality: {
      type: Number,
      default: 80
    },
    activityLevel: {
      type: Number,
      default: 80
    }
  },
  totalSearches: {
    type: Number,
    default: 0
  },
  lastHealthUpdate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to calculate health score based on user data and search history
userSchema.methods.calculateHealthScore = function() {
  let baseScore = 80;
  
  // Adjust score based on medical conditions
  if (this.medicalConditions && this.medicalConditions.length > 0) {
    baseScore -= this.medicalConditions.length * 2;
  }

  // Adjust score based on BMI if height and weight are provided
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    const bmi = this.weight / (heightInMeters * heightInMeters);
    
    // More nuanced BMI scoring
    if (bmi >= 18.5 && bmi <= 24.9) {
      baseScore += 10; // Ideal BMI range
    } else if ((bmi >= 17 && bmi < 18.5) || (bmi > 24.9 && bmi <= 29.9)) {
      baseScore += 5; // Slightly outside ideal range
    } else if ((bmi >= 15 && bmi < 17) || (bmi > 29.9 && bmi <= 34.9)) {
      baseScore -= 5; // Moderate health risk
    } else {
      baseScore -= 10; // High health risk
    }
  }

  // Age-based adjustments
  if (this.age) {
    if (this.age < 30) baseScore += 5;
    else if (this.age > 60) baseScore -= 5;
  }

  // Search history impact
  if (this.totalSearches > 0) {
    // Reward active health monitoring
    baseScore += Math.min(5, this.totalSearches / 10);
  }

  // Calculate health metrics
  let bmi = null;
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    bmi = this.weight / (heightInMeters * heightInMeters);
  }
  
  this.healthMetrics = {
    physicalHealth: Math.min(100, baseScore + (this.medicalConditions ? -this.medicalConditions.length * 3 : 0)),
    mentalWellbeing: Math.min(100, baseScore),
    dietQuality: Math.min(100, baseScore + (bmi && bmi >= 18.5 && bmi <= 24.9 ? 10 : 0)),
    activityLevel: Math.min(100, baseScore + (this.totalSearches > 10 ? 5 : 0))
  };

  // Update last health update timestamp
  this.lastHealthUpdate = new Date();

  // Ensure score stays within 0-100 range
  return Math.min(100, Math.max(0, baseScore));
};

module.exports = mongoose.model('User', userSchema);
