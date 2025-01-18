import express from 'express';
import * as path from 'path';
import cors from 'cors';

import { healthRouter } from './routes/healthRouter';
import { connectDB } from './config/db';
import { AuthRepository } from './repositories/authRepository';
import { AuthAPI } from './routes/authRoute';

const app = express();

// Initialize middlewares
app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

async function main() {
  // Initialize dependencies
  const DB = await connectDB();

  //Initialize repositories

  // TODO: Remove eslint line below
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authRepository = new AuthRepository(DB);

  // Initialize services


  // Initialize APIs
  const authAPI = new AuthAPI('authService');


  // Initialize routers
  const authRouter = express.Router();
  authAPI.registerRoutes(authRouter);


  // Register routers
  app.use('/', authRouter);
  app.use('/health', healthRouter);
}

main().catch((error) => {
  console.error('FATAL: Uncaught exception', error);
  process.exit(1);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
server.on('error', console.error);
