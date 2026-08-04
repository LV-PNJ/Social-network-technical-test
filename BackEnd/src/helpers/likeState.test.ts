import { describe, it, expect } from 'vitest';
import { applyLike, applyUnlike } from './likeState';

describe('likeState idempotency', () => {
  const user = 'user-1';

  it('applyLike adds user once and marks changed', () => {
    const first = applyLike([], user);
    expect(first.changed).toBe(true);
    expect(first.likedBy).toEqual([user]);

    const second = applyLike(first.likedBy, user);
    expect(second.changed).toBe(false);
    expect(second.likedBy).toEqual([user]);
  });

  it('applyUnlike removes only when present', () => {
    const liked = applyUnlike([user, 'other'], user);
    expect(liked.changed).toBe(true);
    expect(liked.likedBy).toEqual(['other']);

    const noop = applyUnlike(['other'], user);
    expect(noop.changed).toBe(false);
    expect(noop.likedBy).toEqual(['other']);
  });

  it('handles null likedBy', () => {
    expect(applyLike(null, user)).toEqual({ likedBy: [user], changed: true });
    expect(applyUnlike(undefined, user)).toEqual({ likedBy: [], changed: false });
  });
});
