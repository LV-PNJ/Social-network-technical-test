import { Request, Response, NextFunction } from 'express';
import { tokenVerify } from '../helpers/verifyToken';
import { AppDataSource } from '../config/dbConfig';
import { User } from '../models/User';
import { formatResponse } from '../helpers/formatResponse';
import { errorFormat } from '../helpers/errors';
import jwt from 'jsonwebtoken';

/**
 * Local User row is a projection of Identity JWT claims (ownership / likes).
 * Auth source of truth remains Identity — PostApi does not register or login.
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
      user.displayName = payload.alias;
      await repo.save(user);
    }
    return user;
  }

  user = repo.create({
    id: payload.sub,
    username: payload.alias,
    displayName: payload.alias,
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
