const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const parentRoutes = require('./routes/parent.routes');
const courseRoutes = require('./routes/course.routes');
const gradeRoutes = require('./routes/grade.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const paymentRoutes = require('./routes/payment.routes');
const messageRoutes = require('./routes/message.routes');
const eventRoutes = require('./routes/event.routes');
const cantineRoutes = require('./routes/cantine.routes');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { limiter } = require('./middleware/rateLimiter.middleware');

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'School ERP API Docs'
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes - v0
app.use('/api/v0/auth', authRoutes);
app.use('/api/v0/users', userRoutes);
app.use('/api/v0/students', studentRoutes);
app.use('/api/v0/teachers', teacherRoutes);
app.use('/api/v0/parents', parentRoutes);
app.use('/api/v0/courses', courseRoutes);
app.use('/api/v0/grades', gradeRoutes);
app.use('/api/v0/assignments', assignmentRoutes);
app.use('/api/v0/attendance', attendanceRoutes);
app.use('/api/v0/payments', paymentRoutes);
app.use('/api/v0/messages', messageRoutes);
app.use('/api/v0/events', eventRoutes);
app.use('/api/v0/cantine', cantineRoutes);

// 404 handler - must come after all routes
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Error: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(' UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app;
