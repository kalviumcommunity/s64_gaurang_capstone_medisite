const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');
const auth = require('../middleware/auth');

// Save search history
router.post('/', auth, async (req, res) => {
  try {
    const { searchQuery, searchType } = req.body;
    const searchHistory = new SearchHistory({
      userId: req.user.id,
      searchQuery,
      searchType
    });
    await searchHistory.save();
    res.status(201).json(searchHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error saving search history', error: error.message });
  }
});

// Get user's search history
router.get('/', auth, async (req, res) => {
  try {
    const searchHistory = await SearchHistory.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(searchHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching search history', error: error.message });
  }
});

// Clear user's search history
router.delete('/', auth, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user.id });
    res.json({ message: 'Search history cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing search history', error: error.message });
  }
});

module.exports = router; 