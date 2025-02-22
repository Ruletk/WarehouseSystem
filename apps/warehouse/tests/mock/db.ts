import { DataSource } from 'typeorm';
import { Warehouse } from '../../src/models/warehouse';
import { WarehouseTag } from '../../src/models/warehouseTag';
import { WarehouseUser } from '../../src/models/warehouseUser';


export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true, // set to false in production
  entities: [Warehouse, WarehouseTag, WarehouseUser],
  // logging: true, // set to false in production
  // migrations: ['../migrations/**/*.ts'],
  // subscribers: ['../subscribers/**/*.ts'],
});

export async function connectDB(): Promise<DataSource> {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
    return AppDataSource;
  } catch (error) {
    console.error('FATAL: Database connection error', error);
    process.exit(1);
  }
}

export async function flushDB(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const entities = AppDataSource.entityMetadatas;
  const tableNames = entities
    .map((entity) => `"${entity.tableName}"`);

  console.log(`entities: ${entities}; tableNames: ${tableNames}`);

  for (const tableName of tableNames){
    console.log(`[${tableName}]`);
    await AppDataSource.query(`DELETE FROM ${tableName};`);
    }
  await AppDataSource.query(`DELETE FROM sqlite_sequence;`);
  console.log('[TEST DATABASE]: Clean');
}
