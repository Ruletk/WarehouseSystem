import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { healthRouter } from './routes/healthRouter';
import { StockRouter } from './routes/stockRouter';
import { createDataSource } from './config/db';
import { ItemRepository } from './repositories/itemRepository';
import { ItemService } from './services/itemService';

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
app.use('/stocks', stockExpressRouter);

// Start the server
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
