/**
 * Pure like/unlike state transitions — used by controller for idempotency.
 */
export function applyLike(
  likedBy: string[] | null | undefined,
  userId: string
): { likedBy: string[]; changed: boolean } {
  const current = likedBy ? [...likedBy] : [];
  if (current.includes(userId)) {
    return { likedBy: current, changed: false };
  }
  current.push(userId);
  return { likedBy: current, changed: true };
}

export function applyUnlike(
  likedBy: string[] | null | undefined,
  userId: string
): { likedBy: string[]; changed: boolean } {
  const current = likedBy ? [...likedBy] : [];
  const index = current.indexOf(userId);
  if (index < 0) {
    return { likedBy: current, changed: false };
  }
  current.splice(index, 1);
  return { likedBy: current, changed: true };
}
