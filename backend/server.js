import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import mongoSanitize from './middleware/mongoSanitize.js';
import {
  apiLimiter,
  authLimiter,
  contactLimiter,
} from './middleware/rateLimit.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import petRoutes from './routes/petRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import productRoutes from './routes/productRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import adoptionRoutes from './routes/adoptionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import careRoutes from './routes/careRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Matches obvious placeholders such as "your_secret_key", "changeme-xxx",
// "please-change-this", "test-secret", ... even with random suffixes appended.
const PLACEHOLDER_SECRET = /(your|my|please|this|the|change[_-]?(me|this)|replace|insert|default|example|test|demo|sample|placeholder|put|add|todo|xxx+)[-_ ]*(secret|jwt|password|key)/i;

const validateEnv = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || !secret.trim()) {
    console.error('FATAL: JWT_SECRET is required but was not set.');
    process.exit(1);
  }
  if (secret.length < 32) {
    console.error('FATAL: JWT_SECRET must be at least 32 characters long.');
    process.exit(1);
  }
  if (PLACEHOLDER_SECRET.test(secret)) {
    console.error('FATAL: JWT_SECRET is still set to a placeholder value. Set a real secret.');
    process.exit(1);
  }
};

validateEnv();

connectDB();

const app = express();

// express-rate-limit reads req.ip, which depends on the X-Forwarded-For header.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const DEV_ORIGINS = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = CLIENT_ORIGINS.length ? CLIENT_ORIGINS : DEV_ORIGINS;

if (!CLIENT_ORIGINS.length && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: CLIENT_ORIGINS is not set; falling back to localhost origins.');
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(helmet());
app.use(apiLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Body parsers must run first so req.body / req.query actually exist to sanitize.
app.use(mongoSanitize);

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    index: false,
    dotfiles: 'deny',
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'");
    },
  })
);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FurShield API is running', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/pets', petRoutes);
app.use('/api/v1/health-records', healthRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/adoptions', adoptionRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/care', careRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FurShield server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});