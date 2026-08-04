import dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
  name: process.env.APP_NAME || 'posts-service',
  /** Inline PEM (preferred in tests/CI). Else JWT_PUBLIC_KEY_PATH or default file. */
  jwtPublicKey: process.env.JWT_PUBLIC_KEY || '',
  jwtPublicKeyPath: process.env.JWT_PUBLIC_KEY_PATH || '',
  jwtIssuer: process.env.JWT_ISSUER || 'identity-service',
  identityUrl: process.env.IDENTITY_URL || 'http://localhost:8081',
};
