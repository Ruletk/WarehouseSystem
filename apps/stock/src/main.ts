import express from 'express';
import * as path from 'path';
import { healthRouter } from './routes/healthRouter';
import { StockRouter } from './routes/stockRouter';

const app = express();

// Middleware and configuration
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Initialize dependencies

// Initialize repositories

// Initialize services

// Initialize routers
const stockRouter = new StockRouter(null);

// Register paths
const stockExpressRouter = express.Router();
stockRouter.registerRoutes(stockExpressRouter);


// Register API paths
app.use('/health', healthRouter);
app.use('/', stockExpressRouter);


// Start the server
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
