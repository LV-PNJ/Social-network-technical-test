import { readFileSync, existsSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { AppConfig } from '../config/appConfig';

/**
 * Legacy helper — Posts API must not sign Identity JWTs.
 * Kept only for local experiments; requires a local private key (gitignored).
 */
const loadPrivateKey = (): string => {
  if (process.env.JWT_PRIVATE_KEY) {
    return process.env.JWT_PRIVATE_KEY;
  }
  const keyPath =
    process.env.JWT_PRIVATE_KEY_PATH ||
    path.join(__dirname, '../config/keys/private.key');
  if (!existsSync(keyPath)) {
    throw new Error(
      'JWT private key not found. Identity signs tokens; Posts only verifies. ' +
        'Set JWT_PRIVATE_KEY / JWT_PRIVATE_KEY_PATH only for local experiments.'
    );
  }
  return readFileSync(keyPath, 'utf8');
};

const algJWT = 'RS256';

export const signToken = (
  payload: object,
  client: string = 'devx'
): string => {
  const privateKey = loadPrivateKey();
  return jwt.sign(payload, privateKey, {
    algorithm: algJWT,
    issuer: AppConfig.name,
    audience: client,
    expiresIn: (process.env.JWT_EXPIRATION as jwt.SignOptions['expiresIn']) || '1h',
  });
};
