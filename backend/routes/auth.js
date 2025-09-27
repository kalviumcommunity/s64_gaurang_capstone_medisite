const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { addUser, getUserByEmail, getUserById } = require('../utils/fallbackStorage');

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', { name: req.body.name, email: req.body.email });
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Using fallback storage. Ready state:', mongoose.connection.readyState);
      
      // Use fallback storage
      if (getUserByEmail(email)) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password for fallback storage
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const user = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        healthScore: 80,
        healthMetrics: {
          physicalHealth: 80,
          mentalWellbeing: 80,
          dietQuality: 80,
          activityLevel: 80
        },
        totalSearches: 0,
        lastHealthUpdate: new Date()
      };
      
      addUser(user);
      
      // Create JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }

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

    // Save user to database
    await user.save();

    // Create JWT token
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
    console.error('Register error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Using fallback storage. Ready state:', mongoose.connection.readyState);
      
      // Use fallback storage
      const user = getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    }

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

    // Create JWT token
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
    console.error('Login error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Signup route (alias for register for compatibility)
router.post('/signup', async (req, res) => {
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

    // Save user to database
    await user.save();

    // Create JWT token
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
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 