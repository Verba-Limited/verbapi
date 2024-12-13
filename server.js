// const app = require('./app');
// const mongoose = require('./config/db');

// const PORT = process.env.PORT || 3000;

// mongoose.connection.once('open', () => {
//   console.log('Connected to MongoDB');
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });


// const express = require('express');
require('dotenv').config(); 
const connectDB = require('./config/db');
// require('./config/db');

const app = require('./app');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Define routes and middlewares...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});