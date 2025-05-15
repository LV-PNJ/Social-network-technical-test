import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';
import { AppConfig } from '../config/appConfig';

const publicKey = readFileSync(path.join(__dirname, '../config/keys/public.key'), 'utf8');

export const tokenVerify = (token: string): Record<string, any> => {
    try {
        const payload = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: AppConfig.name,
            audience: 'devx',
        });

        if (typeof payload !== 'object' || payload === null) {
            throw new Error('Invalid token payload');
        }

        return payload as Record<string, any>;
    } catch (error: any) {
        // Re-lanza el error original para que el middleware lo distinga
        throw error;
    }
};
