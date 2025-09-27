const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const path = require('path');
const mongoose = require('mongoose');
const { getUserById, updateUser } = require('../utils/fallbackStorage');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Profile request received for user:', req.user.userId);
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Using fallback storage. Ready state:', mongoose.connection.readyState);
      
      // Use fallback storage - find user by ID
      const user = getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return user data without password
      const userData = { ...user };
      delete userData.password;
      return res.json(userData);
    }

    // Use database
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Get current user (alias for profile)
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Me request received for user:', req.user.userId);
    
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Using fallback storage. Ready state:', mongoose.connection.readyState);
      
      // Use fallback storage - find user by ID
      const user = getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return user data without password
      const userData = { ...user };
      delete userData.password;
      return res.json(userData);
    }

    // Use database
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, age, gender, height, weight, medicalConditions } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (medicalConditions) user.medicalConditions = medicalConditions;

    // Recalculate health score
    user.healthScore = user.calculateHealthScore();

    await user.save();
    
    // Send back user data without password
    const userData = user.toObject();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Update profile photo
router.post('/profile/photo', auth, async (req, res) => {
  try {
    if (!req.files || !req.files.profilePhoto) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const file = req.files.profilePhoto;
    const fileName = `${user._id}-${Date.now()}-${file.name}`;
    const uploadPath = path.join(__dirname, '../uploads/profiles', fileName);

    await file.mv(uploadPath);
    user.profilePhoto = `/uploads/profiles/${fileName}`;
    await user.save();

    res.json({ profilePhoto: user.profilePhoto });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Get health metrics
router.get('/health-metrics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Recalculate health score before sending
    user.healthScore = user.calculateHealthScore();
    await user.save();

    res.json({
      healthScore: user.healthScore,
      healthMetrics: user.healthMetrics,
      lastHealthUpdate: user.lastHealthUpdate
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ message: 'Error fetching health metrics', error: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
