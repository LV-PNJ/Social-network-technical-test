import { describe, it, expect } from 'vitest';
import { mapAuthError, mapPostsError } from './errorMessages';

describe('mapAuthError', () => {
  it('maps network failures', () => {
    expect(mapAuthError({ status: 'FETCH_ERROR' })).toMatch(/Identity/i);
  });

  it('maps 401 and 409', () => {
    expect(mapAuthError({ status: 401 })).toMatch(/credenciales/i);
    expect(mapAuthError({ status: 409, data: { message: 'alias tomado' } })).toBe('alias tomado');
  });

  it('maps 500', () => {
    expect(mapAuthError({ status: 500 })).toMatch(/error interno/i);
  });
});

describe('mapPostsError', () => {
  it('maps fetch and 401', () => {
    expect(mapPostsError({ status: 'FETCH_ERROR' })).toMatch(/Posts/i);
    expect(mapPostsError({ status: 401 })).toMatch(/Sesión/i);
  });
});
