import express from 'express';
import * as path from 'path';
import cors from 'cors';
import cookies from 'cookie-parser';

import { healthRouter } from './routes/healthRouter';
import { connectDB } from './config/db';
import { AuthRepository } from './repositories/authRepository';
import { AuthAPI } from './routes/authRoute';
import { AuthService } from './services/authService';
import { TokenService } from './services/tokenService';
import { JwtService } from './services/jwtService';
import { RefreshTokenRepository } from './repositories/refreshTokenRepository';
import { EmailService } from './services/emailService';

const app = express();

// Initialize middlewares
app.use(
  cors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookies());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

async function main() {
  // Initialize dependencies
  const DB = await connectDB();

  //Initialize repositories
  const authRepository = new AuthRepository(DB);
  const refreshTokenRepository = new RefreshTokenRepository(DB);

  // Initialize services
  const jwtService = new JwtService();
  const emailService = new EmailService();
  const tokenService = new TokenService(refreshTokenRepository, jwtService);
  const authService = new AuthService(
    authRepository,
    tokenService,
    jwtService,
    emailService
  );

  // Initialize APIs
  const authAPI = new AuthAPI(authService);

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
