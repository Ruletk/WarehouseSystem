import express from 'express';
import * as path from 'path';
import { healthRouter } from './routes/healthRouter';
import { WarehouseAPI } from './routes/warehouseRouter';
import { connectDB } from './config/ds';
import { WarehouseRepository } from './repositories/warehouseRepository';
import { WarehouseTagRepository } from './repositories/warehouseTagRepository';
import { WarehouseUserRepository } from './repositories/warehouseUserRepository';

const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));



async function main() {
  // Initialize Dependencies
  const DB = await connectDB();

  // Initialize Repositories
  const warehouseRepository = new WarehouseRepository(DB);
  const warehouseTagRepository = new WarehouseTagRepository(DB);
  const warehouseUserRepository = new WarehouseUserRepository(DB);
  // To prevent unused variable error
  console.log(!!warehouseRepository, !!warehouseTagRepository, !!warehouseUserRepository);
  // True if all are initialized

  // Initialize Services

  // Initialize APIs
  const warehouseAPI = new WarehouseAPI();

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
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
