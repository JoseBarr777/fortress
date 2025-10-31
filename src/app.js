import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();

// Middleware added
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim())}}));
app.use(securityMiddleware);

// Root Endpoint
app.get('/', (req, res) => {
  logger.info('Hello from Acquisition!');
  res.status(200).send('Hello from Acquisition!');
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// API Base Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisition API is running!' });
});

// Auth Routes
app.use('/api/auth', authRoutes);

export default app;