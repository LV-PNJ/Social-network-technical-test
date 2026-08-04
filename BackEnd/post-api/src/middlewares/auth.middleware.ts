import { Request, Response, NextFunction } from 'express';
import { tokenVerify } from '../helpers/verifyToken';
import { AppDataSource } from '../config/dbConfig';
import { User } from '../models/User';
import { formatResponse } from '../helpers/formatResponse';
import { errorFormat } from '../helpers/errors';
import jwt from 'jsonwebtoken';

/**
 * Ensures a local User row exists for posts ownership/likes.
 * Auth source of truth is Identity; this is a projection from JWT claims.
 */
async function ensureLocalUserFromToken(payload: {
  sub: string;
  alias: string;
}): Promise<User> {
  const repo = AppDataSource.getRepository(User);
  let user = await repo.findOneBy({ id: payload.sub });

  if (user) {
    if (user.username !== payload.alias) {
      user.username = payload.alias;
      await repo.save(user);
    }
    return user;
  }

  user = repo.create({
    id: payload.sub,
    username: payload.alias,
    email: `${payload.alias.toLowerCase()}@identity.local`,
    password: await User.hashPassword(`identity-stub-${payload.sub}`),
    displayName: payload.alias,
    following: [],
    followers: [],
  });

  return repo.save(user);
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: 'No token provided' })
          )
        );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: 'Invalid token format' })
          )
        );
    }

    const decoded = tokenVerify(token);
    const user = await ensureLocalUserFromToken(decoded);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: 'Token expired' })
          )
        );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json(
          formatResponse(
            401,
            errorFormat({ status: 401, message: 'Invalid token' })
          )
        );
    }

    console.error('Unexpected token verification error:', error);
    const err = error as NodeJS.ErrnoException;
    if (err?.code === 'ENOENT') {
      return res.status(503).json(
        formatResponse(
          503,
          errorFormat({
            status: 503,
            message: 'JWT public key not available on Posts API',
            internalCode: 'JWT_KEY_MISSING',
          })
        )
      );
    }
    return res
      .status(500)
      .json(
        formatResponse(
          500,
          errorFormat({ status: 500, message: 'Internal server error' })
        )
      );
  }
};

/** @deprecated Auth moved to Identity service — kept for backward compatibility during migration */
export const validateRegisterInput = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(410).json(
    formatResponse(
      410,
      errorFormat({
        status: 410,
        message:
          'Register moved to Identity service (POST http://localhost:8081/api/auth/register)',
        internalCode: 'AUTH_MOVED',
      })
    )
  );
};

/** @deprecated Auth moved to Identity service */
export const validateLoginInput = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(410).json(
    formatResponse(
      410,
      errorFormat({
        status: 410,
        message:
          'Login moved to Identity service (POST http://localhost:8081/api/auth/login)',
        internalCode: 'AUTH_MOVED',
      })
    )
  );
};
