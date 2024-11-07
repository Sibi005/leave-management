// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Add this to use 'path' module
const connectDB = require('./config/db');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', leaveRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
