import { Request, Response } from 'express';
import { formatResponse } from '../helpers/formatResponse';
import { AppDataSource } from '../config/dbConfig';
import pkg from '../../package.json';

export const checkHealth = async (_: Request, res: Response) => {
  try {
    // Check database connection
    const isDbConnected = AppDataSource.isInitialized;

    // Get system information
    const healthInfo = {
      status: isDbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: pkg.version,
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        type: AppDataSource.options.type
      },
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal
      }
    };

    return res.status(200).json(
      formatResponse(200, {
        message: 'Health check completed',
        internalCode: 'HEALTH',
        ...healthInfo
      })
    );
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json(
      formatResponse(500, {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Failed to check system health'
      })
    );
  }
}; 