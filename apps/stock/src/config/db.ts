import { DataSource } from 'typeorm';
import { Item } from '../models/item';


function createDataSource(): DataSource {
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

  AppDataSource.initialize();
  return AppDataSource;
}

export { createDataSource };
