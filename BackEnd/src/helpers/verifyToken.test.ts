import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { tokenVerify } from './verifyToken';

const privateKey = readFileSync(
  path.join(__dirname, '../config/keys/private.key'),
  'utf8'
);

describe('tokenVerify (RS256)', () => {
  beforeAll(() => {
    process.env.JWT_ISSUER = 'identity-service';
  });

  it('accepts a valid Identity-like token', () => {
    const token = jwt.sign(
      { alias: 'demo', role: 'user' },
      privateKey,
      {
        algorithm: 'RS256',
        subject: 'f6e12a67-e209-447d-8ddd-1f764dcfc026',
        issuer: 'identity-service',
        expiresIn: '1h',
      }
    );

    const payload = tokenVerify(token);
    expect(payload.sub).toBe('f6e12a67-e209-447d-8ddd-1f764dcfc026');
    expect(payload.alias).toBe('demo');
    expect(payload.iss).toBe('identity-service');
  });

  it('rejects token without alias claim', () => {
    const token = jwt.sign(
      { role: 'user' },
      privateKey,
      {
        algorithm: 'RS256',
        subject: 'abc',
        issuer: 'identity-service',
        expiresIn: '1h',
      }
    );
    expect(() => tokenVerify(token)).toThrow(/alias/i);
  });

  it('rejects wrong issuer', () => {
    const token = jwt.sign(
      { alias: 'demo' },
      privateKey,
      {
        algorithm: 'RS256',
        subject: 'abc',
        issuer: 'other-service',
        expiresIn: '1h',
      }
    );
    expect(() => tokenVerify(token)).toThrow();
  });
});
