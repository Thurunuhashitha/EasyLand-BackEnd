// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS for local React dev
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import land routes
const landRoutes = require('./routes/landRoutes');
app.use('/api/land', landRoutes);

// Start server
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});