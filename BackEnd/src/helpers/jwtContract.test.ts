import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const privateKey = readFileSync(
  path.join(__dirname, '../config/keys/private.key'),
  'utf8'
);
const publicKey = readFileSync(
  path.join(__dirname, '../config/keys/public.key'),
  'utf8'
);
const ISSUER = 'identity-service';

describe('Identity JWT contract (RS256)', () => {
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
