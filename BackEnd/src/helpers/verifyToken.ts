import { readFileSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { AppConfig } from '../config/appConfig';

export type IdentityTokenPayload = {
  sub: string;
  alias: string;
  role?: string;
  iat?: number;
  exp?: number;
  iss?: string;
};

const loadPublicKey = (): string => {
  if (AppConfig.jwtPublicKey) {
    return AppConfig.jwtPublicKey;
  }
  return readFileSync(path.join(__dirname, '../config/keys/public.key'), 'utf8');
};

export const tokenVerify = (token: string): IdentityTokenPayload => {
  const publicKey = loadPublicKey();
  const payload = jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: AppConfig.jwtIssuer,
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
    iss: (payload as jwt.JwtPayload).iss,
  };
};
