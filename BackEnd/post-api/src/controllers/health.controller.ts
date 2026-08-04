import { Request, Response } from 'express';
import { formatResponse } from '../helpers/formatResponse';
import { AppDataSource } from '../config/dbConfig';
import { AppConfig } from '../config/appConfig';
import pkg from '../../package.json';
import { getMqttLikesTopic } from '../realtime/mqttPublisher';
import { logger } from '../helpers/logger';

async function probeIdentity(timeoutMs = 2000): Promise<'up' | 'down'> {
  const url = `${AppConfig.identityUrl.replace(/\/$/, '')}/actuator/health`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res.ok ? 'up' : 'down';
  } catch {
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}

export const checkHealth = async (_: Request, res: Response) => {
  try {
    const isDbConnected = AppDataSource.isInitialized;
    const identity = await probeIdentity();

    const status =
      isDbConnected && identity === 'up'
        ? 'healthy'
        : isDbConnected
          ? 'degraded'
          : 'unhealthy';

    const healthInfo = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: pkg.version,
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        type: AppDataSource.options.type,
      },
      dependencies: {
        identity: {
          status: identity,
          url: AppConfig.identityUrl,
        },
      },
      realtime: {
        websocketPath: '/ws',
        mqttUrl: process.env.MQTT_URL || 'mqtt://localhost:1883',
        mqttLikesTopic: getMqttLikesTopic(),
        mqttQos: 1,
      },
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
      },
    };

    if (status === 'degraded') {
      logger.warn('health.degraded', { identity, db: isDbConnected });
    }

    const httpStatus = status === 'unhealthy' ? 503 : 200;
    return res.status(httpStatus).json(
      formatResponse(httpStatus, {
        message: 'Health check completed',
        internalCode: 'HEALTH',
        ...healthInfo,
      })
    );
  } catch (error) {
    logger.error('health.failed', { error: String(error) });
    return res.status(500).json(
      formatResponse(500, {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Failed to check system health',
      })
    );
  }
};