import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.status(200).send({
    status: 'OK',
    timestamp: new Date(),
  });
});

export { healthRouter };
