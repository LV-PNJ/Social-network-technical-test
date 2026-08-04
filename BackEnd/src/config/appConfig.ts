import dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
  name: process.env.APP_NAME || 'posts-service',
  jwtSecret: process.env.JWT_SECRET || 'devexp-change-me-use-at-least-32-chars!!',
  identityUrl: process.env.IDENTITY_URL || 'http://localhost:8081',
};
