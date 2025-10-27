const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const connectionRoutes = require('./routes/connections');

// Initialize app
const app = express();

// CORS configuration - MUST be before other middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://linkedin-clone-neon-one.vercel.app',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEPLOYED_URL
].filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

// Apply CORS middleware FIRST
app.use(cors({
  origin: function(origin, callback) {
    console.log('Request from origin:', origin);
    
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) {
      console.log('No origin - allowing');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed from list');
      return callback(null, true);
    }
    
    // Allow any localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('Localhost origin - allowing');
      return callback(null, true);
    }
    
    console.log('⚠️ Origin not in allowed list, but allowing anyway');
    return callback(null, true); // Allow all for now
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  optionsSuccessStatus: 204,
  preflightContinue: false
}));

// Increase payload limit to handle image uploads (Base64 encoded images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connections', connectionRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'LinkedIn Clone API is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API status endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle payload too large error
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      message: 'File too large. Please upload an image smaller than 50MB.'
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
