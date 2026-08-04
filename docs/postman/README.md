# Postman — pruebas de integración

Colección: [`DEVEXP.postman_collection.json`](DEVEXP.postman_collection.json)

## Qué valida

| Carpeta | Tipo | Cobertura |
|---------|------|-----------|
| **00 - Health** | Smoke | Identity UP, Posts healthy + metadata MQTT |
| **01 - Identity** | Integración | Validación 400, login 401/200, JWT RS256, `/profiles/me`, 401 sin token |
| **02 - Posts** | Integración | 401 sin JWT, listar, crear, like, like idempotente, unlike |
| **03 - Flujo E2E** | Integración punta a punta | Register (sin token) → Login → Me → Create → Like → 409 alias duplicado |

## Cómo correr en Postman

1. Importar `DEVEXP.postman_collection.json`
2. Variables de colección: `identityUrl=http://localhost:8081`, `postsUrl=http://localhost:8876`
3. **Collection Runner** → seleccionar toda la colección → **Run** (orden de carpetas)
4. Ver pestaña **Test Results** (asserts `pm.test`)

## Cómo correr con Newman (CLI)

```bash
# Stack arriba: docker compose up -d
npm i -g newman
cd docs/postman
newman run DEVEXP.postman_collection.json --reporters cli
```

O desde la raíz del repo:

```bash
npx --yes newman run docs/postman/DEVEXP.postman_collection.json
```

## Variables que escribe la colección

| Variable | Quién la setea |
|----------|----------------|
| `token` | Login demo / E2E login |
| `postId` | Create post |
| `regAlias` / `regEmail` | Pre-request E2E register (único por timestamp) |

## Prerrequisito

```bash
docker compose up -d
# Identity :8081, Posts :8876, demo/Demo123!
```
