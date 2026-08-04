import { Request, Response } from 'express';
import { formatResponse } from '../helpers/formatResponse';
import { errorFormat } from '../helpers/errors';
import { AppConfig } from '../config/appConfig';

const moved = (res: Response, action: string) =>
  res.status(410).json(
    formatResponse(
      410,
      errorFormat({
        status: 410,
        message: `${action} is handled by Identity at ${AppConfig.identityUrl}`,
        internalCode: 'AUTH_MOVED',
      })
    )
  );

export const register = async (_req: Request, res: Response) =>
  moved(res, 'Register');

export const login = async (_req: Request, res: Response) =>
  moved(res, 'Login');

export const getMe = async (_req: Request, res: Response) =>
  moved(res, 'Profile /me');
