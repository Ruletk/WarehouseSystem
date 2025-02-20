import express from 'express';
import * as path from 'path';
import cors from 'cors';
import cookies from 'cookie-parser';
import { getLogger } from '@warehouse/logging';

import { healthRouter } from './routes/healthRouter';
import { connectDB } from './config/db';
import { AuthRepository } from './repositories/authRepository';
import { AuthAPI } from './routes/authRoute';
import { AuthService } from './services/authService';
import { TokenService } from './services/tokenService';
import { JwtService } from './services/jwtService';
import { RefreshTokenRepository } from './repositories/refreshTokenRepository';
import { EmailService } from './services/emailService';

const logger = getLogger('main');

const app = express();

// Initialize middlewares
app.use(
  cors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookies());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

async function main() {
  logger.info('Starting authentication service');

  try {
    logger.debug('Initializing database connection');
    const DB = await connectDB();

    logger.debug('Initializing repositories');
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

    logger.debug('Registering routes');
    app.use('/', authRouter);
    app.use('/health', healthRouter);

    logger.info('Authentication service initialized successfully');
  } catch (error) {
    logger.crit('Failed to initialize authentication service', {
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
    throw error;
  }
}

main().catch((error) => {
  logger.crit('Fatal: Uncaught exception', {
    error: {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  });
  process.exit(1);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  logger.info('Server started', {
    port,
    url: `http://localhost:${port}`,
    nodeEnv: process.env.NODE_ENV
  });
});

server.on('error', (error) => {
  logger.error('Server error occurred', {
    error: {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.warn('Received SIGTERM signal, initiating graceful shutdown');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.warn('Received SIGINT signal, initiating graceful shutdown');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
