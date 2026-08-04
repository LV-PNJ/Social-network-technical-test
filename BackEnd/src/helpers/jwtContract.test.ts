import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';

const SECRET = 'devexp-change-me-use-at-least-32-chars!!';

describe('Identity JWT contract (HS256)', () => {
  it('accepts tokens with sub + alias like Identity issues', () => {
    const token = jwt.sign(
      { alias: 'demo', role: 'user' },
      SECRET,
      { algorithm: 'HS256', subject: 'f6e12a67-e209-447d-8ddd-1f764dcfc026', expiresIn: '1h' }
    );
    const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] }) as jwt.JwtPayload;
    expect(payload.sub).toBe('f6e12a67-e209-447d-8ddd-1f764dcfc026');
    expect(payload.alias).toBe('demo');
  });

  it('rejects wrong secret', () => {
    const token = jwt.sign({ alias: 'demo' }, SECRET, {
      algorithm: 'HS256',
      subject: 'abc',
    });
    expect(() => jwt.verify(token, 'wrong-secret-key-at-least-32-chars!!!!', { algorithms: ['HS256'] })).toThrow();
  });
});
