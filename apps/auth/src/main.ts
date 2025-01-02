import express from 'express';
import * as path from 'path';
import { authRouter } from './routes/authRoute';
import { healthRouter } from './routes/healthRouter';

const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/', authRouter);
app.use('/health', healthRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
server.on('error', console.error);
