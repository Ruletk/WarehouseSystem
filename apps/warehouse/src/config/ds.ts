import { DataSource } from 'typeorm';
import { Warehouse } from '../models/warehouse';
import { WarehouseTag } from '../models/warehouseTag';
import {WarehouseUser} from "../models/warehouseUser";
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'db',
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
