# Arquitectura — DEVEXP v2

## Decisiones

| Tema | Decisión | Por qué |
|------|----------|---------|
| Identity | Java 17 + Spring Boot | Requisito obligatorio del PDF; dominio auth/perfiles |
| Posts | Node.js + Express + TypeORM | Asincronía y WebSocket simples para likes |
| JWT | HS256 compartido (`JWT_SECRET`) | Verificación local en Posts sin acoplar a session store |
| Realtime | WebSocket en Posts | Menos infra que MQTT; suficiente para demo de likes |
| DB | PostgreSQL + schema `identity` | ORM + Flyway en Identity; TypeORM synchronize en Posts |
| Frontend | React (opcional) | UX; no reemplaza Java/Node |

## Diagrama de componentes

```mermaid
flowchart LR
  Browser[React Client :3000]
  Identity[Identity API<br/>Java Spring :8081]
  Posts[Posts API<br/>Node Express :8876]
  WS[WebSocket /ws]
  DB[(PostgreSQL)]

  Browser -->|login / profiles| Identity
  Browser -->|posts / likes REST| Posts
  Browser -->|likes live| WS
  WS --- Posts
  Identity --> DB
  Posts --> DB
  Posts -.->|health probe| Identity
```

## Diagrama de despliegue (Docker Compose)

```mermaid
flowchart TB
  subgraph host [Host]
    C[client :3000]
    I[identity :8081]
    A[api :8876]
    D[db :5433→5432]
  end

  C --> I
  C --> A
  A --> D
  I --> D
  A -->|depends_on healthy| I
  A -->|depends_on healthy| D
  I -->|depends_on healthy| D
```

## Secuencia — Login

```mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as React
  participant ID as Identity
  participant DB as Postgres

  U->>FE: alias + password
  FE->>ID: POST /api/auth/login
  ID->>DB: buscar usuario + BCrypt
  ID-->>FE: JWT HS256 + userId/alias
  FE->>FE: guardar token
  FE->>ID: GET /api/profiles/me (Bearer)
  ID-->>FE: perfil completo
```

## Secuencia — Publicar

```mermaid
sequenceDiagram
  participant FE as React
  participant P as Posts
  participant DB as Postgres

  FE->>P: POST /api/posts + Bearer JWT
  P->>P: verificar JWT (HS256)
  P->>DB: upsert usuario local (proyección)
  P->>DB: insert post
  P-->>FE: post creado
```

## Secuencia — Like en tiempo real

```mermaid
sequenceDiagram
  participant FE1 as Cliente A
  participant FE2 as Cliente B
  participant P as Posts
  participant WS as WebSocket hub

  FE2->>WS: connect /ws
  FE1->>P: POST /api/posts/:id/like
  P->>P: idempotencia (si ya likeó: noop)
  P->>WS: broadcast post.like.updated
  WS-->>FE2: eventId + likedBy
  FE2->>FE2: actualizar cache feed
```

## Degradación

| Fallo | Comportamiento |
|-------|----------------|
| Identity down | Banner en UI; login/registro fallan con mensaje claro; Posts marca `degraded` en `/api/health` |
| Posts down | Banner; Identity sigue permitiendo login; feed no carga |
| DB down | Ambos APIs unhealthy; Compose healthchecks fallan |

Ver también [realtime-likes.md](realtime-likes.md).
