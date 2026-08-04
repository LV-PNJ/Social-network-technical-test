import jwt from 'jsonwebtoken';
import { AppConfig } from '../config/appConfig';

export type IdentityTokenPayload = {
  sub: string;
  alias: string;
  role?: string;
  iat?: number;
  exp?: number;
};

export const tokenVerify = (token: string): IdentityTokenPayload => {
  const payload = jwt.verify(token, AppConfig.jwtSecret, {
    algorithms: ['HS256'],
  });

  if (typeof payload !== 'object' || payload === null || !payload.sub) {
    throw new Error('Invalid token payload');
  }

  const alias = (payload as jwt.JwtPayload).alias;
  if (typeof alias !== 'string' || !alias) {
    throw new Error('Token missing alias claim');
  }

  return {
    sub: String(payload.sub),
    alias,
    role: typeof (payload as jwt.JwtPayload).role === 'string'
      ? String((payload as jwt.JwtPayload).role)
      : 'user',
    iat: (payload as jwt.JwtPayload).iat,
    exp: (payload as jwt.JwtPayload).exp,
  };
};
