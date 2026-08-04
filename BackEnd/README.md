# BackEnd — servicios

| Carpeta | Servicio | Puerto | Stack |
|---------|----------|--------|-------|
| [`identity-service/`](identity-service/) | **Identity** | 8081 | Java 17 / Spring Boot |
| [`post-api/`](post-api/) | **PostApi** | 8876 | Node / Express / TypeORM |
| [`certs/`](certs/) | JWT RSA (compartido) | — | `private.key` Identity · `public.key` Identity + PostApi |

El Front no vive aquí → `FrontEnd/`.
