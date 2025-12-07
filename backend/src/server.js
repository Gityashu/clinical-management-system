require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pool = require('./config/database');

// Import Repositories
const PatientRepository = require('./repositories/PatientRepository');
const BaseRepository = require('./repositories/BaseRepository');
const BillingRepository = require('./repositories/BillingRepository');


// Import Services
const AuthService = require('./services/AuthService');
const BillingService = require('./services/BillingService');


// Import Controllers
const AuthController = require('./controllers/AuthController');
const PatientController = require('./controllers/PatientController');
const BillingController = require('./controllers/BillingController');


// Import Middleware
const errorHandler = require('./middleware/errorHandler');
const { authMiddleware } = require('../middleware/authMiddleware');


// Import Routes
const billingRoutes = require('./routes/billingRoutes');

// Initialize Express
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Repositories
const patientRepository = new PatientRepository(pool);
const appointmentRepository = new BaseRepository(pool, 'appointments');
const doctorRepository = new BaseRepository(pool, 'doctors');
const medicineRepository = new BaseRepository(pool, 'medicines');
const billingRepository = new BillingRepository(pool);


// Initialize Services
const authService = new AuthService(pool);
const billingService = new BillingService(billingRepository);

// Initialize Controllers
const authController = new AuthController(authService);
const patientController = new PatientController(patientRepository);
const billingController = new BillingController(billingService);

// Routes
app.use('/api/auth', require('./routes/authRoutes')(authController));
app.use('/api/patients', require('./routes/patientRoutes')(patientController));
app.use('/api/billing', billingRoutes(billingController));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏥 Medical Clinic Backend is Running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🏥 MEDICAL CLINIC MANAGEMENT SYSTEM                  ║
║  Backend Server Running                                ║
╠════════════════════════════════════════════════════════╣
║  ✅ Server: http://localhost:${PORT}                  ║
║  ✅ Database: clinic_management                       ║
║  ✅ pgAdmin: http://localhost:5050                    ║
║  ✅ 3-Tier Architecture Initialized                   ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
