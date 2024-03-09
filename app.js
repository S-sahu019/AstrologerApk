const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const astrologerRoutes = require('./routes/astrologerRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error(error);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/astrologers', astrologerRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});