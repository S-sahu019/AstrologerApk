const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Astrologer = require('../models/astrologerModel');
const config = require('../config');

// Generate a JWT token for a user
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    name: user.name,
  };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
  return token;
};

// Register a new Astrologer
router.post('/register', async (req, res) => {
  const { name, orders, chargePerMin, astroSpecialization, experience, totalTimeInChat, totalTimeInCall, astrologerDescription, status, languageKnown, reviews, ratings } = req.body;

  try {
    const existingAstrologer = await Astrologer.findOne({ name });

    if (existingAstrologer) {
      return res.status(409).json({ message: 'Astrologer already exists' });
    }

    const newAstrologer = new Astrologer({
      name,
      orders,
      chargePerMin,
      astroSpecialization,
      experience,
      totalTimeInChat,
      totalTimeInCall,
      astrologerDescription,
      status,
      languageKnown,
      reviews,
      ratings,
    });

    await newAstrologer.save();

    res.status(201).json({ message: 'Astrologer created successfully', astrologer: newAstrologer, token: generateToken(newAstrologer) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login a Astrologer
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const astrologer = await Astrologer.findOne({ name });

    if (!astrologer) {
      return res.status(401).json({ message: 'Invalid name or password' });
    }

    const isPasswordValid = await astrologer.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid name or password' });
    }

    res.status(200).json({ message: 'Logged in successfully', astrologer, token: generateToken(astrologer) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;