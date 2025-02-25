import { Router } from 'express';
import { getLogger } from '@warehouse/logging';

const logger = getLogger('healthRouter');

const healthRouter = Router();

logger.info('Initializing health check router');

healthRouter.get('/', (_req, res) => {
  logger.debug('Health check requested', {
    ip: _req.ip,
    userAgent: _req.headers['user-agent']
  });

  const timestamp = new Date();
  const response = {
    status: 'OK',
    timestamp,
  };

  logger.info('Health check completed', {
    status: response.status,
    responseTime: Date.now() - timestamp.getTime()
  });

  res.status(200).send(response);
});

healthRouter.get('/deep', async (_req, res) => {
  logger.debug('Deep health check requested', {
    ip: _req.ip,
    userAgent: _req.headers['user-agent']
  });

  const startTime = Date.now();
  try {
    // Add your deep health checks here (DB, cache, etc.)
    const status = 'OK';
    const checks = {
      database: true,
      api: true
    };

    logger.info('Deep health check completed', {
      status,
      checks,
      responseTime: Date.now() - startTime
    });

    res.status(200).send({
      status,
      checks,
      timestamp: new Date()
    });
  } catch (error) {
    logger.error('Health check failed', {
      error: error.message,
      responseTime: Date.now() - startTime
    });

    res.status(503).send({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date()
    });
  }
});

export { healthRouter };
