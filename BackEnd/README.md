# BackEnd — servicios

| Carpeta | Servicio | Puerto | Stack |
|---------|----------|--------|-------|
| [`identity-service/`](identity-service/) | **Identity** | 8081 | Java 17 / Spring Boot — auth + perfiles |
| [`post-api/`](post-api/) | **PostApi** | 8876 | Node / Express — posts, likes, MQTT |
| [`certs/`](certs/) | JWT RSA | — | `private.key` Identity · `public.key` Identity + PostApi |

PostApi **no** registra ni hace login; solo verifica JWT de Identity.
