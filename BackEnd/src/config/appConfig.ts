import dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
    name: process.env.APP_NAME || 'Social Network',
    jwtExpiration: process.env.JWT_EXPIRATION || '3m',
};
