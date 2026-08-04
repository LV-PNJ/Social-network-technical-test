# Manual de instalación — DEVEXP Social Network

**Versión:** 2.0  
**Fecha:** 2026-07-31  
**Audiencia:** Evaluador / desarrollador en máquina limpia

## 1. Propósito

Levantar la solución completa (Identity Java, Posts Node, Frontend React, PostgreSQL) de forma reproducible con Docker Compose.

## 2. Requisitos previos

| Requisito | Notas |
|-----------|--------|
| Docker Desktop o Docker Engine + Compose v2 | Obligatorio |
| Git | Para clonar el repositorio |
| Puertos libres | 3000, 8081, 8876, 5433 |

No se requiere instalar Java ni Node en el host para la demo.

## 3. Obtención del código

```bash
git clone <URL-del-repositorio>
cd Social-network-technical-test
```

## 4. Configuración de entorno (sin secretos en Git)

```bash
cp .env.example .env
# PowerShell (Windows): generar par RSA gitignored
.\scripts\generate-jwt-keys.ps1
```

Editar `.env` (mínimo): poner un `POSTGRES_PASSWORD` propio (no dejar `change-me` en entornos reales).

Opcional local (fuera de Compose):

```bash
cp BackEnd/.env.example BackEnd/.env
cp FrontEnd/mi-tumblr-clone/.env.example FrontEnd/mi-tumblr-clone/.env
```

**Importante:** no versionar `.env`, `*.key` ni `*.pem`. Detalle: [secrets.md](./secrets.md).

## 5. Arranque

```bash
docker compose up --build
```

Primera ejecución: Identity puede tardar 1–2 minutos (descarga JDK + Maven build).

Verificar:

```bash
docker compose ps
# identity = healthy, db = healthy, api y client = Up
```

## 6. Verificación funcional

1. Abrir http://localhost:3000  
2. Login: alias `demo` / password `Demo123!`  
3. Identity health: http://localhost:8081/actuator/health  
4. Posts health: http://localhost:8876/api/health (debe mostrar `dependencies.identity.status: up`)  
5. Swagger Identity: http://localhost:8081/swagger-ui.html  
6. Swagger Posts: http://localhost:8876/docs/

## 7. Pruebas automatizadas

```bash
docker compose exec api npm test
```

Tests Java (JDK 17+ o stage de build):

```bash
cd services/identity-service
./mvnw test
```

## 8. Parada y limpieza

```bash
docker compose down        # conserva datos
docker compose down -v     # elimina volumen Postgres
```

## 9. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| Bind 5432 failed | Otro Postgres en el host | Ya se usa host **5433**; no cambiar a 5432 si está ocupado |
| Identity unhealthy | Build lento / DB no lista | Esperar; `docker compose logs identity` |
| Login “no se pudo contactar Identity” | Servicio caído | Banner en UI; revisar `docker compose ps` |
| FE sin vars Vite | Contenedor sin env | Compose inyecta `VITE_*`; rebuild client |

## 10. Estructura del monorepo

```
services/identity-service/   # Java Identity & Profiles
BackEnd/                     # Node Posts + WebSocket
FrontEnd/mi-tumblr-clone/    # React UI
docs/                        # Arquitectura, realtime, manuales
docker-compose.yml
.env.example
```

## 11. Referencias

- Arquitectura: `docs/architecture.md`
- Likes tiempo real: `docs/realtime-likes.md`
- Manual de usuario: `docs/manual-usuario.md`
