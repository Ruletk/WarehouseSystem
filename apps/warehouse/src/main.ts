import express from 'express';
import * as path from 'path';
import { applyOptions, getLogger } from '@warehouse/logging';

applyOptions({
  level: process.env.LOG_LEVEL || 'debug',
  label: 'warehouse',
});

import { healthRouter } from './routes/healthRouter';
import { WarehouseAPI } from './routes/warehouseRouter';
import { connectDB } from './config/ds';
import { WarehouseRepository } from './repositories/warehouseRepository';
import { WarehouseTagRepository } from './repositories/warehouseTagRepository';
import { WarehouseUserRepository } from './repositories/warehouseUserRepository';
import { WarehouseUserService } from './services/warehouseUserService';
import { WarehouseTagService } from './services/warehouseTagService';
import { WarehouseService } from './services/warehouseService';
import { DataSource } from 'typeorm';


const start = Date.now();
const logger = getLogger('main');


logger.info('Starting warehouse service', { startTimestamp: start });
const app = express();

logger.info('Initializing warehouse service');

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));


let DB: DataSource;

async function main() {
  logger.debug('Starting warehouse service initialization');

  try {
    // Initialize Dependencies
    logger.debug('Initializing database connection');
    DB = await connectDB();

    // Initialize Repositories
    logger.debug('Initializing repositories');
    const warehouseRepository = new WarehouseRepository(DB);
    const warehouseTagRepository = new WarehouseTagRepository(DB);
    const warehouseUserRepository = new WarehouseUserRepository(DB);

    // Initialize Services
    logger.debug('Initializing services');
    const warehouseService = new WarehouseService(warehouseRepository);
    const warehouseTagService = new WarehouseTagService(warehouseTagRepository);
    const warehouseUserService = new WarehouseUserService(warehouseUserRepository);

    // Initialize APIs
    logger.debug('Initializing API layer');
    const warehouseAPI = new WarehouseAPI(
      warehouseService,
      warehouseTagService,
      warehouseUserService
    );

    // Initialize Routers
    logger.debug('Setting up routes');
    const warehouseRouter = express.Router();
    warehouseAPI.registerRoutes(warehouseRouter);

    // Register Routers
    logger.debug('Registering routes');
    app.use('/', warehouseRouter);
    app.use('/health', healthRouter);

    logger.info('Warehouse service initialized successfully');
  } catch (error) {
    logger.crit('Failed to initialize warehouse service', {
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
    throw error;
  }
}

main().catch((error) => {
  logger.crit('Fatal: Uncaught exception in main', {
    error: {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  });
  process.exit(1);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  const elapsed = Date.now() - start;
  logger.info(`Listening at http://localhost:${port}, started in ${elapsed}ms`, {
    startTimestamp: start,
    elapsedTimestamp: elapsed,
  });
});
server.on('error', console.error);


async function shutdown() {
  const stop = Date.now();
  logger.info('Initiating graceful shutdown...', { stopTimestamp: stop });
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

  const elapsed = Date.now() - stop;
  logger.info('Graceful shutdown complete', {
    stopTimestamp: stop,
    elapsedTimestamp: elapsed,
  });

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
