# Social Network Technical Test (DEVEXP v2)

Red social en **microservicios** (Java + Node) para la prueba técnica Full Stack DEVEXP.

## Requisitos previos

- Docker Desktop / Docker Engine + Compose v2
- Puertos libres: **3000**, **8081**, **8876**, **5433**, **1883/9001** (MQTT)

No necesitas instalar Java/Node en el host para ejecutar la demo.

## Arranque en máquina limpia

```bash
git clone <tu-repo>
cd Social-network-technical-test

cp .env.example .env
# Editar POSTGRES_PASSWORD en .env — no commitear .env
powershell -File .\scripts\generate-jwt-keys.ps1

docker compose up --build
```

Secretos: [docs/secrets.md](docs/secrets.md). Las llaves en `./certs` están gitignored.
Espera a que Identity esté `healthy` (~30–60s la primera vez).

### Usuario demo

| Campo | Valor |
|-------|-------|
| Alias | `demo` |
| Password | `Demo123!` |

## URLs

| Superficie | URL |
|------------|-----|
| Frontend | http://localhost:3000 |
| Identity Swagger | http://localhost:8081/swagger-ui.html |
| Identity health | http://localhost:8081/actuator/health |
| Posts Swagger | http://localhost:8876/docs/ |
| Posts health | http://localhost:8876/api/health |
| Likes MQTT (browser) | `ws://localhost:9001` topic `devexp/posts/likes` |
| Likes WebSocket (sec.) | `ws://localhost:8876/ws` |

## Arquitectura (resumen)

| Servicio | Stack | Puerto | Rol |
|----------|-------|--------|-----|
| `identity` | Java 17 / Spring Boot / JPA / Flyway | 8081 | Auth + perfiles (nombres, apellidos, nacimiento, alias) |
| `api` | Node / Express / TypeORM | 8876 | Publicaciones, likes REST + MQTT publish |
| `mqtt` | Eclipse Mosquitto | 1883 / 9001 | Broker likes (TCP + WS) |
| `client` | React / Vite / MUI | 3000 | UI |
| `db` | PostgreSQL 15 | 5433→5432 | Persistencia |

- JWT **RS256**: Identity firma con `certs/private.key`; Posts verifica con `certs/public.key`.
- Posts **no** registra usuarios: valida el token de Identity y proyecta un usuario local para ownership/likes.
- Diagramas (secuencia, componentes, infra, despliegue): [docs/diagramas/](docs/diagramas/)
- Arquitectura: [docs/architecture.md](docs/architecture.md)
- Realtime: [docs/realtime-likes.md](docs/realtime-likes.md)

## Flujo happy path

1. Abrir http://localhost:3000 → Login con `demo` / `Demo123!`
2. Crear una publicación
3. Dar like (otra pestaña verá el contador vía MQTT)
4. Ver perfil (nombres, apellidos, fecha, alias)

## Tests

```bash
# Posts (Node) — dentro del contenedor (Node 21)
docker compose exec api npm test

# Identity (Java) — rebuild con tests o JDK 17+ local
docker compose exec identity sh -c "echo 'usar mvnw test en build stage / JDK 17'"
# Local con wrapper:
# cd services/identity-service && ./mvnw test
```

## Degradación

Si Identity o Posts no responden, el frontend muestra un **banner** y mensajes controlados (sin stack traces).  
`GET /api/health` en Posts incluye `dependencies.identity` y puede responder `degraded`.

## Secretos

- Usa `.env` (no se versiona). Plantilla: `.env.example`
- No commits de claves `*.key` / `*.pem` (ver `.gitignore`)

## Documentación de entrega

| Documento | Ruta |
|-----------|------|
| Manual instalación (MD/PDF) | `docs/manual-instalacion.md`, `docs/Manual_Instalacion_DEVEXP.pdf` |
| Manual usuario (MD/PDF) | `docs/manual-usuario.md`, `docs/Manual_Usuario_DEVEXP.pdf` |
| Guía sustentación | `docs/guia-sustentacion.md` |
| Checklist rúbrica | `docs/checklist-entrega.md` |
| Postman (integración) | `docs/postman/` — Newman: 43 asserts |
| Arquitectura | `docs/architecture.md` |
| Diagramas | `docs/diagramas/` |
| Logging | `docs/logging.md` |
| Realtime | `docs/realtime-likes.md` |

## Parar

```bash
docker compose down
# con volumen DB:
docker compose down -v
```
