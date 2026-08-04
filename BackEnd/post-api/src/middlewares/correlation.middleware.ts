import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const CORRELATION_HEADER = 'x-correlation-id';

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const incoming = req.header(CORRELATION_HEADER);
  const correlationId =
    incoming && incoming.trim().length > 0 ? incoming.trim() : randomUUID();
  (req as Request & { correlationId?: string }).correlationId = correlationId;
  res.setHeader(CORRELATION_HEADER, correlationId);
  next();
}

export function getCorrelationId(req: Request): string {
  return (req as Request & { correlationId?: string }).correlationId || 'unknown';
}
