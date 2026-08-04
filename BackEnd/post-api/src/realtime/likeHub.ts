import { randomUUID } from 'crypto';
import { publishLikeEvent } from './mqttPublisher';
import type { LikeRealtimeEvent } from './likeEvents';

export type { LikeRealtimeEvent } from './likeEvents';

/**
 * Publishes like/unlike updates via MQTT only (topic devexp/posts/likes, QoS 1).
 */
export function broadcastLikeUpdate(
  payload: Omit<LikeRealtimeEvent, 'type' | 'eventId' | 'at'>
): LikeRealtimeEvent {
  const event: LikeRealtimeEvent = {
    type: 'post.like.updated',
    eventId: randomUUID(),
    at: new Date().toISOString(),
    ...payload,
  };

  publishLikeEvent(event);
  return event;
}
