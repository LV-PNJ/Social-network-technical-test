# Checklist de entrega vs Prueba_Técnica_DEVEXP_v2

Marca antes de la sustentación.

## Alcance funcional §4.2

- [x] Auth usuario/contraseña (Identity)
- [x] Listar publicaciones de otros (Posts feed)
- [x] Crear publicación (mensaje, autor, fecha)
- [x] Perfil: nombres, apellidos, nacimiento, alias
- [x] Likes + tiempo real (WebSocket)
- [x] Permisos (JWT + ownership update/delete)
- [x] ≥2 APIs (Identity Java + Posts Node)

## Técnicos §5

- [x] Hash seguro (BCrypt Identity)
- [x] Token JWT
- [x] Validación de entradas
- [x] CORS
- [x] ORM (JPA + TypeORM)
- [x] PostgreSQL + Flyway (Identity) + seed demo
- [x] MQTT/WebSocket (WebSocket documentado)
- [x] Contrato error Identity (timestamp, code, details, correlationId)
- [x] Swagger/OpenAPI (+ Postman en `docs/postman/`)
- [x] Diagramas (`docs/architecture.md`)
- [x] Dockerfiles + compose + healthchecks
- [x] Tests unitarios ejecutables
- [x] Logs / correlation (Posts JSON + header; Identity MDC)
- [x] Sin secretos en repo (`.env.example`, gitignore)
- [x] Paginación posts
- [x] Degradación controlada (banner + health degraded)
- [x] README reproducible

## Entregables §7

- [x] Repo organizado (services + BackEnd + FrontEnd)
- [x] Código + config + migraciones + pruebas
- [x] Docs API (Swagger + Postman)
- [x] Arquitectura / diagramas
- [x] Manual instalación (MD + PDF)
- [x] Manual usuario (MD + PDF)
- [x] Guía sustentación

## Pendiente opcional / mejoras

- [ ] Migraciones TypeORM formales (hoy synchronize en Posts)
- [ ] Trazas distribuidas (OpenTelemetry)
- [ ] DB separada por servicio
- [ ] Auth en handshake WebSocket
