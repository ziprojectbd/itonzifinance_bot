const express = require('express');
const router = express.Router();
const User = require('../models/User');

// CREATE a new user
router.post('/', async (req, res) => {
  const { uid, userName, firstName, lastName } = req.body;
  if (!uid || !userName) {
    return res.status(400).json({ message: 'Missing uid or userName' });
  }
  try {
    const user = new User({ uid, userName, firstName, lastName });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// READ user by uid
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE user by uid
router.put('/:uid', async (req, res) => {
  try {
    const update = req.body;
    const user = await User.findOneAndUpdate({ uid: req.params.uid }, update, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE user by uid
router.delete('/:uid', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// LIST all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;