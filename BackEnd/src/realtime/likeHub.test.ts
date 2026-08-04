import { describe, it, expect, vi, beforeEach } from 'vitest';

const publishLikeEvent = vi.fn();

vi.mock('../realtime/mqttPublisher', () => ({
  publishLikeEvent: (...args: unknown[]) => publishLikeEvent(...args),
  connectMqttPublisher: vi.fn(),
  getMqttLikesTopic: () => 'devexp/posts/likes',
}));

describe('broadcastLikeUpdate', () => {
  beforeEach(() => {
    publishLikeEvent.mockClear();
    vi.resetModules();
  });

  it('publishes MQTT event with type post.like.updated and eventId', async () => {
    const { broadcastLikeUpdate } = await import('../realtime/likeHub');

    const event = broadcastLikeUpdate({
      postId: 'post-1',
      likedBy: ['u1'],
      likeCount: 1,
      actorUserId: 'u1',
      action: 'like',
      correlationId: 'c-1',
    });

    expect(event.type).toBe('post.like.updated');
    expect(event.eventId).toBeTruthy();
    expect(event.postId).toBe('post-1');
    expect(event.action).toBe('like');
    expect(publishLikeEvent).toHaveBeenCalledTimes(1);
    expect(publishLikeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'post.like.updated',
        postId: 'post-1',
        action: 'like',
      })
    );
  });
});
