import dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
  name: process.env.APP_NAME || 'posts-service',
  /** Optional inline PEM; otherwise file at src/config/keys/public.key is used */
  jwtPublicKey: process.env.JWT_PUBLIC_KEY || '',
  jwtIssuer: process.env.JWT_ISSUER || 'identity-service',
  identityUrl: process.env.IDENTITY_URL || 'http://localhost:8081',
};
