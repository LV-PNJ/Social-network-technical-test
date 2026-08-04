import { Request, Response, NextFunction } from 'express';
import { getCorrelationId } from './correlation.middleware';
import { logger } from '../helpers/logger';

export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const path = req.originalUrl || req.url;
  if (path.startsWith('/api/health') || path.startsWith('/api-docs') || path.startsWith('/swagger')) {
    next();
    return;
  }

  const started = Date.now();
  const correlationId = getCorrelationId(req);

  logger.info('posts.request.start', {
    method: req.method,
    path,
    correlationId,
    remote: req.ip,
  });

  res.on('finish', () => {
    logger.info('posts.request.end', {
      method: req.method,
      path,
      status: res.statusCode,
      durationMs: Date.now() - started,
      correlationId,
    });
  });

  next();
}
