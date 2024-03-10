const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const astrologerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  orders: {
    type: Number,
    default: 0,
  },
  chargePerMin: {
    type: Number,
    required: true,
  },
  astroSpecialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  totalTimeInChat: {
    type: Number,
    default: 0,
  },
  totalTimeInCall: {
    type: Number,
    default: 0,
  },
  astrologerDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  languageKnown: {
    type: [String],
    required: true,
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
});
astrologerSchema.methods.generateToken = function () {
    const astrologer = this;
    const token = jwt.sign(
      {
        id: astrologer._id,
        email: astrologer.email,
      },
      config.jwtSecret,
      {
        expiresIn: '1h',
      }
    );
  
    return token;
  };
  

const Astrologer = mongoose.model('Astrologer', astrologerSchema);
module.exports= Astrologer;