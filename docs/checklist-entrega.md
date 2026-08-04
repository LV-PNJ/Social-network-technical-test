# Checklist de entrega vs Prueba_Técnica_DEVEXP_v2

Actualizado tras implementación completa (auth RS256, MQTT, tests, Postman integración, logs).

## Alcance funcional §4.2

- [x] Auth usuario/contraseña (Identity Java)
- [x] Listar publicaciones de otros (Posts feed)
- [x] Crear publicación (mensaje, autor, fecha)
- [x] Perfil: nombres, apellidos, nacimiento, alias
- [x] Likes + tiempo real (**MQTT** primario + WebSocket secundario)
- [x] Permisos (JWT + ownership update/delete)
- [x] ≥2 APIs (Identity Java + Posts Node)

## Técnicos §5

- [x] Hash seguro (BCrypt Identity)
- [x] Token JWT **RS256** (certs PEM)
- [x] Validación de entradas
- [x] Control de acceso + CORS
- [x] ORM (JPA + TypeORM)
- [x] PostgreSQL + Flyway (Identity) + seed demo
- [~] Migraciones Posts (hoy TypeORM synchronize — parcial)
- [x] MQTT/WebSocket + doc reconexión/idempotencia/consistencia
- [~] Contrato error §5.1 (Identity 100%; Posts envelope distinto — parcial)
- [x] Swagger/OpenAPI + Postman integración (Newman)
- [x] Diagramas (`docs/diagramas/`)
- [x] Dockerfiles + compose + healthchecks
- [x] Tests unitarios + integración ejecutables
- [~] Observabilidad (logs color+archivo + correlationId + actuator; sin OTel — parcial valorado)
- [x] Sin secretos en repo (`.env` / `*.key` untracked; `.env.example`; `docs/secrets.md`; script `scripts/generate-jwt-keys.ps1`)
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

## Oral (no es gap de código)

- [ ] §6 Prueba teórica (60 min)
- [ ] §8 Caso situacional (exposición)

## Mejoras opcionales

- [ ] Migraciones TypeORM formales
- [ ] Unificar envelope de error Posts → §5.1
- [ ] OpenTelemetry
- [ ] Auth en handshake WebSocket
- [ ] DB separada por servicio
