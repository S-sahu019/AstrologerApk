const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const config = require('../config/config');

// Generate a JWT token for a user
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
  return token;
};

// Hash a password before saving it to the database
User.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare a password with the stored hash
User.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Register a new User
router.post('/register', async (req, res) => {
  const { username, email, password, contactNumber, gender, dob, pob, currentAddress, city } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      email,
      password,
      contactNumber,
      gender,
      dob,
      pob,
      currentAddress,
      city,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser, token: generateToken(newUser) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login a User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Logged in successfully', user, token: generateToken(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;