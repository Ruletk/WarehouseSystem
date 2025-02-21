import { DataSource } from 'typeorm';
import { Auth } from '../models/auth';
import { RefreshToken } from '../models/refreshToken';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('database');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'db',
  synchronize: true, // set to false in production
  entities: [Auth, RefreshToken],
  // logging: true, // set to false in production
  // migrations: ['../migrations/**/*.ts'],
  // subscribers: ['../subscribers/**/*.ts'],
});

export async function connectDB(): Promise<DataSource> {
  logger.info('Configuring database connection', {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'db',
    username: process.env.DB_USER || 'postgres',
  });

  try {
    const startTime = Date.now();
    await AppDataSource.initialize();
    const connectionTime = Date.now() - startTime;

    logger.info('Connection established successfully', {
      connectionTimeMs: connectionTime,
      entities: AppDataSource.entityMetadatas.map(entity => entity.name),
      isSynchronized: AppDataSource.isInitialized,
      databaseName: AppDataSource.options.database
    });

    return AppDataSource;
  } catch (error) {
    logger.crit('Failed to establish database connection', {
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'db',
        username: process.env.DB_USER || 'postgres'
      }
    });

    process.exit(1);
  }
}
