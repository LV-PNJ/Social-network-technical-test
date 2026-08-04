import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { randomUUID } from 'crypto';
import { logger } from '../helpers/logger';

export type LikeRealtimeEvent = {
  type: 'post.like.updated';
  eventId: string;
  postId: string;
  likedBy: string[];
  likeCount: number;
  actorUserId: string;
  action: 'like' | 'unlike';
  correlationId?: string;
  at: string;
};

let wss: WebSocketServer | null = null;

export function attachLikeWebSocket(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (socket, req) => {
    logger.info('ws.connected', { path: req.url, clients: wss?.clients.size });
    socket.send(
      JSON.stringify({
        type: 'ws.hello',
        message:
          'Connected to likes channel. Reconnect with backoff on close. Events are idempotent by eventId.',
      })
    );

    socket.on('close', () => {
      logger.info('ws.disconnected', { clients: wss?.clients.size });
    });
  });

  return wss;
}

export function broadcastLikeUpdate(
  payload: Omit<LikeRealtimeEvent, 'type' | 'eventId' | 'at'>
): LikeRealtimeEvent {
  const event: LikeRealtimeEvent = {
    type: 'post.like.updated',
    eventId: randomUUID(),
    at: new Date().toISOString(),
    ...payload,
  };

  if (!wss) {
    logger.warn('ws.broadcast.skipped', { reason: 'server_not_ready', postId: event.postId });
    return event;
  }

  const raw = JSON.stringify(event);
  let sent = 0;
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(raw);
      sent += 1;
    }
  }
  logger.info('ws.broadcast', {
    postId: event.postId,
    action: event.action,
    eventId: event.eventId,
    recipients: sent,
  });
  return event;
}
