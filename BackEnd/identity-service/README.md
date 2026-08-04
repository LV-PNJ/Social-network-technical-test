# Identity & Profiles API (Java / Spring Boot)

Servicio de autenticación y perfiles para la prueba técnica DEVEXP v2.

## Endpoints

| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registro + JWT |
| POST | `/api/auth/login` | No | Login (alias o email) |
| GET | `/api/profiles/me` | Bearer | Perfil propio |
| PUT | `/api/profiles/me` | Bearer | Actualizar perfil |
| GET | `/api/profiles/{alias}` | Bearer | Perfil por alias |
| GET | `/actuator/health` | No | Health |
| GET | `/swagger-ui.html` | No | OpenAPI UI |

## Perfil (campos PDF)

`firstName`, `lastName`, `birthDate`, `alias` (+ `email` para auth)

## Error contract

```json
{
  "timestamp": "2026-07-22T15:30:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "La solicitud contiene datos inválidos",
  "details": [{"field": "alias", "reason": "obligatorio"}],
  "correlationId": "..."
}
```

## Demo user

Tras el primer arranque: `alias=demo` / `password=Demo123!`

## Local (Docker) — recomendado

Desde la raíz del monorepo:

```bash
docker compose up --build identity db
```

API: http://localhost:8081  
Swagger: http://localhost:8081/swagger-ui.html

## Local (NetBeans / Maven)

**Requisito:** JDK **17+** (Spring Boot 4). JDK 11 **no sirve**.

1. NetBeans → Tools → Java Platforms → Add Platform → JDK 17  
2. Project Properties → Libraries / Build → Java Platform = JDK 17  
3. Run with Spring Boot goal (no el exec genérico de NetBeans):

```bash
cd BackEnd/identity-service
.\mvnw.cmd spring-boot:run
```

O en NetBeans: **Run Maven** → `spring-boot:run`.

El error `Could not find or load main class ${start-class}` ocurría porque NetBeans usaba `exec-maven-plugin` sin resolver la propiedad. En `pom.xml` ya está definido:

```xml
<start-class>com.terpel.devexp.identity.IdentityServiceApplication</start-class>
```

Aun así, con JDK 11 el proyecto no compilará/arrancará: instala Temurin 17 y selecciónalo en NetBeans.