const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const chatRoutes = require('./routes/chat');
const medicalRecordsRoutes = require('./routes/medicalRecords');
const medicationsRoutes = require('./routes/medications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MediVerse.AI Backend' });
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/medications', medicationsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ MediVerse.AI Backend running on port ${PORT}`);
});

module.exports = app;
