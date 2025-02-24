import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { getLogger, applyOptions } from '@warehouse/logging';

applyOptions({
  level: process.env.LOG_LEVEL || 'debug',
  label: 'stock',
});

import { healthRouter } from './routes/healthRouter';
import { StockRouter } from './routes/stockRouter';
import { createDataSource } from './config/db';
import { ItemRepository } from './repositories/itemRepository';
import { ItemService } from './services/itemService';

const start = Date.now();
const logger = getLogger('main');

logger.info('Starting stock service', {
  startTimestamp: start,
  nodeEnv: process.env.NODE_ENV
});

const app = express();

// Middleware setup
logger.debug('Configuring middleware');
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Initialize dependencies
logger.debug('Initializing database');
const db = createDataSource();

// Initialize repositories
logger.debug('Initializing repositories');
const itemRepository = new ItemRepository(db);

// Initialize services
logger.debug('Initializing services');
const itemService = new ItemService(itemRepository);

// Initialize routers
logger.debug('Setting up routes');
const stockRouter = new StockRouter(itemService);
const stockExpressRouter = express.Router();
stockRouter.registerRoutes(stockExpressRouter);

// Register API paths
logger.debug('Registering API routes', {
  routes: ['/health', '/']
});
app.use('/health', healthRouter);
app.use('/', stockExpressRouter);

// Start the server
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  const elapsed = Date.now() - start;
  logger.info('Server started successfully', {
    url: `http://localhost:${port}`,
    startupTime: elapsed,
    nodeEnv: process.env.NODE_ENV
  });
});

server.on('error', (error) => {
  logger.error('Server error occurred', {
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  });
});

async function shutdown() {
  const stop = Date.now();
  logger.info('Initiating graceful shutdown', { timestamp: stop });

  // Express server
  server.close((error) => {
    if (error) {
      logger.error('Failed to close server', {
        error: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
      process.exit(1);
    }
    logger.info('Server closed successfully');
  });

  // Database connection
  try {
    if (db) {
      logger.debug('Closing database connection');
      await db.destroy();
      logger.info('Database connection closed successfully');
    }
  } catch (error) {
    logger.error('Failed to close database connection', {
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }

  const elapsed = Date.now() - stop;
  logger.info('Graceful shutdown complete', {
    shutdownTime: elapsed,
    timestamp: Date.now()
  });

  setTimeout(() => {
    process.exit(0);
  }, 200);
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.warn('Received SIGTERM signal');
  shutdown();
});

process.on('SIGINT', () => {
  logger.warn('Received SIGINT signal');
  shutdown();
});
