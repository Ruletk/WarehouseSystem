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

logger.info('Starting stock service', { startTimestamp: start });
const app = express();

// Middleware and configuration
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
const db = createDataSource();

// Initialize repositories
const itemRepository = new ItemRepository(db);

// Initialize services
const itemService = new ItemService(itemRepository);

// Initialize routers
const stockRouter = new StockRouter(itemService);

// Register paths
const stockExpressRouter = express.Router();
stockRouter.registerRoutes(stockExpressRouter);

// Register API paths
app.use('/health', healthRouter);

// Add stock router with validation middleware
app.use('/', stockExpressRouter);

// Start the server
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  const elapsed = Date.now() - start;
  logger.info(
    `Listening at http://localhost:${port}, started in ${elapsed}ms`,
    { startTimestamp: start, elapsedTimestamp: elapsed }
  );
});
server.on('error', console.error);


async function shutdown() {
  const stop = Date.now();
  logger.info('Initiating graceful shutdown...', {stopTimestamp: stop});
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
    if (db) {
      logger.debug('Closing database connection');
      await db.destroy();
    }
  } catch (error) {
    logger.error('Failed to close database connection', {
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }

  const elapsed = Date.now() - stop;
  logger.info('Graceful shutdown complete', {stopTimestamp: stop, elapsedTimestamp: elapsed});
  
  // To ensure that logs are written before exiting
  setTimeout(() => {
    process.exit(0);
  }, 200); 
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