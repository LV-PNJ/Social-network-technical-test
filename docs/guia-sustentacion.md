# Guía de sustentación (30–45 min)

Checklist verbal alineado al código entregado. No memorices definiciones: **señala archivos**.

## Minuto 0–5 — Arranque en vivo

1. `docker compose ps` → identity healthy, api/client up  
2. Abrir FE :3000, login `demo`/`Demo123!`  
3. Mostrar Swagger Identity y Posts  
4. `GET /api/health` → `dependencies.identity: up`

## Minuto 5–15 — Arquitectura y stack

**Pregunta esperada:** ¿Por qué Java y Node?

- **Identity (Java/Spring):** auth, hash BCrypt, perfiles PDF, Flyway, contrato de error §5.1  
  - Paquete: `services/identity-service/.../web`, `security/JwtService`  
- **Posts (Node):** CRUD posts, likes, WebSocket, proyección local de usuario desde JWT  
  - `BackEnd/src/middlewares/auth.middleware.ts`, `realtime/likeHub.ts`  
- **React:** opcional, cliente; no sustituye los dos backends  

Diagrama: `docs/architecture.md`

**JWT RS256:** Identity firma con llave privada PEM; Posts verifica con la pública (`./certs`). No se comparte el secreto de firma.

## Minuto 15–25 — Flujo funcional

### Login
1. FE → `POST Identity /api/auth/login`  
2. Token en storage  
3. `GET /api/profiles/me`  
Archivos: `AuthController`, `userApiSlice.ts`

### Publicar
1. Bearer JWT a Posts  
2. `verifyToken` upsert User local (`id` = `sub`, `username` = `alias`)  
3. Insert Post  

### Like + realtime
1. REST `POST /posts/:id/like` (fuente de verdad, idempotente)  
2. Broadcast `post.like.updated` por `/ws`  
3. FE `useLikeRealtime` + dedupe `eventId`  
Doc: `docs/realtime-likes.md`

## Minuto 25–35 — No funcionales

| Tema | Dónde está |
|------|------------|
| Hash passwords | Identity BCrypt / Posts no almacena credenciales reales de Identity |
| Validación | Jakarta Validation + class-validator |
| Errores Identity | `ApiError` + `GlobalExceptionHandler` (timestamp, code, details, correlationId) |
| Paginación | `?page=&size=` en list posts |
| Observabilidad | logs JSON Posts; `X-Correlation-Id`; actuator Identity |
| Degradación | Banner FE; health `degraded` si Identity down |
| Secretos | `.env.example`, `.gitignore` |
| Contenedores | Dockerfiles + healthchecks Compose |
| Tests | `docker compose exec api npm test`; `JwtServiceTest` Java |

## Minuto 35–45 — Preguntas difíciles (respuestas cortas)

**¿Por qué no microservicios “puros” con DB por servicio?**  
Misma instancia Postgres, schema `identity` + tablas Posts. Trade-off de demo vs aislamiento; se puede separar DBs después.

**¿MQTT vs WebSocket?**  
WS en el mismo proceso Posts reduce piezas. Modelo de entrega/reconexión/idempotencia documentado.

**¿Qué pasa si Identity cae con token ya emitido?**  
Posts sigue validando JWT hasta expiración; nuevos logins fallan; UI avisa.

**¿ORM?**  
JPA + Flyway en Identity; TypeORM en Posts. Justify: productividad y mapeo entidades.

**¿CORS?**  
Habilitado en ambos APIs para el origen del FE.

## Demo script (2 min)

1. Login demo  
2. Crear post “Sustentación DEVEXP”  
3. Like; opcional segunda pestaña para ver update  
4. Abrir perfil y señalar campos PDF  
5. Mostrar un error de validación en Swagger (register sin alias)
