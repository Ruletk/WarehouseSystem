import { DataSource } from 'typeorm';
import { Item } from '../models/item';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('database');

function createDataSource(): DataSource {
  logger.debug('Creating data source', {
    host: 'db',
    port: 5432,
    database: 'db'
  });

  const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'db',
    entities: [Item],
    synchronize: true,
  });

  logger.info('Initializing database connection');
  AppDataSource.initialize()
    .then(() => {
      logger.info('Database connection established', {
        entities: AppDataSource.entityMetadatas.map(entity => entity.name),
        isSynchronized: AppDataSource.isInitialized
      });
    })
    .catch((error) => {
      logger.error('Database connection failed', {
        error: {
          message: error.message,
          code: error.code,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
    });

  return AppDataSource;
}

export { createDataSource };
