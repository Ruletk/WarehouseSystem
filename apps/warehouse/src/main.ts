import express from 'express';
import * as path from 'path';
import { healthRouter } from './routes/healthRouter';
import { warehouseRouter } from './routes/warehouseRouter';

const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/', warehouseRouter);
app.use('/health', healthRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
