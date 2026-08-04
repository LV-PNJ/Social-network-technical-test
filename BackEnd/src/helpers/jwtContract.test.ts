import { describe, it, expect, beforeAll } from 'vitest';
import { generateKeyPairSync } from 'crypto';
import jwt from 'jsonwebtoken';

const ISSUER = 'identity-service';

describe('Identity JWT contract (RS256)', () => {
  let privateKey: string;
  let publicKey: string;

  beforeAll(() => {
    const pair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    privateKey = pair.privateKey;
    publicKey = pair.publicKey;
  });

  it('accepts tokens with sub + alias like Identity issues', () => {
    const token = jwt.sign(
      { alias: 'demo', role: 'user' },
      privateKey,
      {
        algorithm: 'RS256',
        subject: 'f6e12a67-e209-447d-8ddd-1f764dcfc026',
        issuer: ISSUER,
        expiresIn: '1h',
      }
    );
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: ISSUER,
    }) as jwt.JwtPayload;
    expect(payload.sub).toBe('f6e12a67-e209-447d-8ddd-1f764dcfc026');
    expect(payload.alias).toBe('demo');
    expect(payload.iss).toBe(ISSUER);
  });

  it('rejects token signed with another key', () => {
    const other = jwt.sign({ alias: 'demo' }, 'hs-secret-not-rsa-at-least-32-chars!!', {
      algorithm: 'HS256',
      subject: 'abc',
      issuer: ISSUER,
    });
    expect(() =>
      jwt.verify(other, publicKey, { algorithms: ['RS256'], issuer: ISSUER })
    ).toThrow();
  });
});
