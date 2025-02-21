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

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));


let DB: DataSource;

async function main() {
  // Initialize Dependencies
  DB = await connectDB();

  // Initialize Repositories
  const warehouseRepository = new WarehouseRepository(DB);
  const warehouseTagRepository = new WarehouseTagRepository(DB);
  const warehouseUserRepository = new WarehouseUserRepository(DB);
  // To prevent unused variable error
  console.log(
    !!warehouseRepository,
    !!warehouseTagRepository,
    !!warehouseUserRepository
  );
  // True if all are initialized

  // Initialize Services
  const warehouseService = new WarehouseService(warehouseRepository);
  const warehouseTagService = new WarehouseTagService(warehouseTagRepository);
  const warehouseUserService = new WarehouseUserService(
    warehouseUserRepository
  );
  // Initialize APIs
  const warehouseAPI = new WarehouseAPI(
    warehouseService,
    warehouseTagService,
    warehouseUserService
  );

  // Initialize Routers
  const warehouseRouter = express.Router();
  warehouseAPI.registerRoutes(warehouseRouter);

  // Register Routers
  app.use('/', warehouseRouter);
  app.use('/health', healthRouter);
}

main().catch((error) => {
  console.error(error);
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
