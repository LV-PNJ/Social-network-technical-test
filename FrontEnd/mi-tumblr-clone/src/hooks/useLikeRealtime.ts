import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
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

function resolveWsUrl(): string {
  const fromEnv = import.meta.env.VITE_WS_URL as string | undefined;
  if (fromEnv) return fromEnv;
  const api = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8876/api';
  try {
    const u = new URL(api);
    u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:';
    u.pathname = '/ws';
    u.search = '';
    return u.toString();
  } catch {
    return 'ws://localhost:8876/ws';
  }
}

/**
 * Subscribes to like updates. Reconnects with exponential backoff.
 * Deduplicates by eventId for at-least-once delivery consistency.
 */
export function useLikeRealtime(enabled = true) {
  const dispatch = useDispatch();
  const attemptRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !getStoredToken()) return;

    let closed = false;
    let socket: WebSocket | null = null;

    const connect = () => {
      if (closed) return;
      const url = resolveWsUrl();
      socket = new WebSocket(url);

      socket.onopen = () => {
        attemptRef.current = 0;
      };

      socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data?.type !== 'post.like.updated') return;
          const event = data as LikeEvent;
          if (seenEvents.has(event.eventId)) return;
          seenEvents.add(event.eventId);
          if (seenEvents.size > 500) {
            const first = seenEvents.values().next().value;
            if (first) seenEvents.delete(first);
          }

          dispatch(
            postApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
              const post = draft.find((p) => p.id === event.postId);
              if (post) {
                post.likedBy = event.likedBy;
              }
            })
          );
          dispatch(
            postApiSlice.util.updateQueryData('getPosts', { page: 1, size: 20 }, (draft) => {
              const post = draft.find((p) => p.id === event.postId);
              if (post) {
                post.likedBy = event.likedBy;
              }
            })
          );
          dispatch(postApiSlice.util.invalidateTags([{ type: 'Post', id: event.postId }]));
        } catch {
          // ignore malformed frames
        }
      };

      socket.onclose = () => {
        if (closed) return;
        const attempt = Math.min(attemptRef.current + 1, 6);
        attemptRef.current = attempt;
        const delay = Math.min(1000 * 2 ** (attempt - 1), 15000);
        timerRef.current = window.setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      closed = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      socket?.close();
    };
  }, [dispatch, enabled]);
}
