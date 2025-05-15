import { readFileSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { AppConfig } from '../config/appConfig';

const privateKey = readFileSync(path.join(__dirname, '../config/keys/private.key'), 'utf8');
const algJWT = 'RS256'; // Algoritmo de firma con clave privada RSA

export const signToken = (
    payload: object,
    client: string = 'devx'
): string => {
    const token = jwt.sign(payload, privateKey, {
        algorithm: algJWT,
        issuer: AppConfig.name,
        audience: client,
        expiresIn: AppConfig.jwtExpiration,
    });

    return token;
};
