require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const mongoose = require('mongoose');

// Configure CORS options
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    'https://gitbackend.vercel.app',
    'https://c17d5f31-ed06-4a21-878f-59e26c706b98.lovableproject.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Apply CORS before other middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// WebSockets setup
const { io, emitNotification } = require('./websockets/notificationHandler')(server);
app.set('emitNotification', emitNotification);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/enterprise-clients', require('./routes/enterpriseClients'));

// Database status route
app.get('/api/database/status', (req, res) => {
  const status = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.options('*', cors(corsOptions));
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 3001;  // Consistently use 3001
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('MongoDB connected and ready to accept connections');
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});