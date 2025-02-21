import { DataSource } from 'typeorm';
import { Warehouse } from '../models/warehouse';
import { WarehouseTag } from '../models/warehouseTag';
import { WarehouseUser } from '../models/warehouseUser';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('database');

logger.info('Configuring warehouse database source', {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'db'
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'db',
  synchronize: true, // set to false in production
  entities: [Warehouse, WarehouseTag, WarehouseUser],
});

export async function connectDB(): Promise<DataSource> {
  logger.debug('Starting warehouse database connection', {
    entityCount: AppDataSource.options.entities?.length || 0
  });

  try {
    const startTime = Date.now();
    await AppDataSource.initialize();
    const connectionTime = Date.now() - startTime;

    logger.info('Warehouse database connected', {
      connectionTimeMs: connectionTime,
      entities: AppDataSource.entityMetadatas.map(entity => entity.name)
    });

    return AppDataSource;
  } catch (error) {
    logger.crit('Warehouse database connection failed', {
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
    process.exit(1);
  }
}

// Shutdown handling
process.on('SIGINT', async () => {
  logger.warn('Database shutdown initiated');

  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.info('Database connection closed');
    }
  } catch (error) {
    logger.error('Database shutdown failed', {
      error: error.message
    });
  }

  process.exit(0);
});
