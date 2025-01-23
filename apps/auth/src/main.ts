import express from 'express';
import * as path from 'path';
import cors from 'cors';
import cookies from 'cookie-parser';
import { applyOptions, getLogger } from '@warehouse/logging';

applyOptions({
  level: process.env.LOG_LEVEL || 'debug',
  label: 'auth',
});

import { healthRouter } from './routes/healthRouter';
import { connectDB } from './config/db';
import { AuthRepository } from './repositories/authRepository';
import { AuthAPI } from './routes/authRoute';
import { AuthService } from './services/authService';
import { TokenService } from './services/tokenService';
import { JwtService } from './services/jwtService';
import { RefreshTokenRepository } from './repositories/refreshTokenRepository';
import { EmailService } from './services/emailService';
import { DataSource } from 'typeorm';

const start = Date.now();

const logger = getLogger('main');

const app = express();

// Initialize middlewares
app.use(
  cors({
    origin: 'http://localhost:4200', // Разрешить запросы только с фронтенда
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Разрешить передачу кук
  })
);
app.use(express.json());
app.use(cookies());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Обработка OPTIONS-запросов
app.options('*', cors());

async function main() {
  logger.info('Starting authentication service');

  try {
    logger.debug('Initializing database connection');
    DB = await connectDB();

  // Initialize repositories
  const authRepository = new AuthRepository(DB);
  const refreshTokenRepository = new RefreshTokenRepository(DB);

    logger.debug('Initializing services');
    const jwtService = new JwtService();
    const emailService = new EmailService();
    const tokenService = new TokenService(refreshTokenRepository, jwtService);
    const authService = new AuthService(
      authRepository,
      tokenService,
      jwtService,
      emailService
    );

    logger.debug('Initializing API routes');
    const authAPI = new AuthAPI(authService);
    const authRouter = express.Router();
    authAPI.registerRoutes(authRouter);

  // Register routers
  app.use('/api/v1', authRouter); // Добавьте префикс /api/v1
  app.use('/health', healthRouter);
}

main().catch((error) => {
  console.error('FATAL: Uncaught exception', error);
  process.exit(1);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  const elapsed = Date.now() - start;
  logger.info('Server started', {
    port,
    url: `http://localhost:${port}`,
    nodeEnv: process.env.NODE_ENV,
    elapsed,
  });
});

server.on('error', (error) => {
  logger.error('Server error occurred', {
    error: {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
  });
});

async function shutdown() {
  logger.info('Initiating graceful shutdown...');
  // Express server
  server.close((error) => {
    if (error) {
      logger.error('Failed to close server', {
        error: {
          message: error.message,
          stack:
            process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
      });
      process.exit(1);
    }
  });

  // Database connection
  try {
    if (DB) {
      logger.debug('Closing database connection');
      await DB.destroy();
    }
  } catch (error) {
    logger.error('Failed to close database connection', {
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }

  logger.info('Graceful shutdown complete');
  process.exit(0);
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.warn('Received SIGTERM signal, initiating graceful shutdown');
  shutdown();
});

process.on('SIGINT', () => {
  logger.warn('Received SIGINT signal, initiating graceful shutdown');
  shutdown();
});
