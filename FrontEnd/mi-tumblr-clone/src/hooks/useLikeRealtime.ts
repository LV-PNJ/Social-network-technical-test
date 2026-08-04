import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import mqtt, { type MqttClient } from 'mqtt';
import { postApiSlice } from '@/features/posts/postApiSlice';
import { getStoredToken } from '@/utils/storage';

type LikeEvent = {
  type: 'post.like.updated';
  eventId: string;
  postId: string;
  likedBy: string[];
  likeCount: number;
  actorUserId: string;
  action: 'like' | 'unlike';
};

const seenEvents = new Set<string>();

const DEFAULT_TOPIC = 'devexp/posts/likes';

function resolveMqttWsUrl(): string {
  return (
    (import.meta.env.VITE_MQTT_WS_URL as string | undefined) ||
    'ws://localhost:9001'
  );
}

function resolveTopic(): string {
  return (
    (import.meta.env.VITE_MQTT_LIKES_TOPIC as string | undefined) || DEFAULT_TOPIC
  );
}

function applyLikeEvent(
  dispatch: ReturnType<typeof useDispatch>,
  event: LikeEvent
) {
  if (seenEvents.has(event.eventId)) return;
  seenEvents.add(event.eventId);
  if (seenEvents.size > 500) {
    const first = seenEvents.values().next().value;
    if (first) seenEvents.delete(first);
  }

  dispatch(
    postApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
      const post = draft.find((p) => p.id === event.postId);
      if (post) post.likedBy = event.likedBy;
    })
  );
  dispatch(
    postApiSlice.util.updateQueryData('getPosts', { page: 1, size: 20 }, (draft) => {
      const post = draft.find((p) => p.id === event.postId);
      if (post) post.likedBy = event.likedBy;
    })
  );
  dispatch(postApiSlice.util.invalidateTags([{ type: 'Post', id: event.postId }]));
}

/**
 * Subscribes to like updates via MQTT over WebSockets (browser).
 * Broker reconnect + QoS 1; client dedupes by eventId.
 */
export function useLikeRealtime(enabled = true) {
  const dispatch = useDispatch();
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (!enabled || !getStoredToken()) return;

    const url = resolveMqttWsUrl();
    const topic = resolveTopic();
    const client = mqtt.connect(url, {
      clientId: `devexp-fe-${Math.random().toString(16).slice(2)}`,
      clean: true,
      reconnectPeriod: 2000,
      connectTimeout: 10_000,
      protocol: 'ws',
    });
    clientRef.current = client;

    client.on('connect', () => {
      client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error('mqtt.subscribe.failed', err);
        }
      });
    });

    client.on('message', (_t, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        if (data?.type !== 'post.like.updated') return;
        applyLikeEvent(dispatch, data as LikeEvent);
      } catch {
        // ignore malformed payloads
      }
    });

    client.on('error', (err) => {
      console.error('mqtt.client.error', err);
    });

    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, [dispatch, enabled]);
}
