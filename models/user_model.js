const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  pob: {
    type: String,
    required: true,
  },
  currentAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.methods.generateToken = function () {
    const user = this;
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      config.jwtSecret,
      {
        expiresIn: '24h',
      }
    );
  
    return token;
  };
const User  = mongoose.model('User', userSchema);
module.exports = User;