# Tiempo real — likes (WebSocket)

## Modelo

- Canal: `ws://localhost:8876/ws` (mismo host que Posts API).
- Evento: `post.like.updated` con `eventId`, `postId`, `likedBy`, `likeCount`, `action`, `correlationId`.
- REST sigue siendo la fuente de verdad (`POST/DELETE /api/posts/:id/like`).
- El hub solo notifica cambios; no acepta likes por WebSocket.

## Conexión y reconexión

1. Cliente abre `/ws` tras autenticarse.
2. Servidor envía `ws.hello`.
3. Ante `close`/`error`, el cliente reintenta con backoff exponencial (1s → 15s máx).
4. Tras reconectar, el feed REST + eventos posteriores re-sincronizan el estado.

## Entrega e idempotencia

- Un like repetido del mismo usuario **no** cambia estado ni re-emite evento (`like.idempotent_noop`).
- Cada evento lleva `eventId` (UUID). El cliente descarta duplicados.
- Consistencia: eventual entre clientes; el autor del like ve el REST response inmediato y el broadcast.

## CORS / auth

- WS abierto en desarrollo (sin token obligatorio en handshake).
- Operaciones mutantes siguen exigiendo Bearer JWT en REST.
