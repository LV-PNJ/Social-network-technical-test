# JWT RSA keys (RS256) — solo backends

Usadas por **Identity** (`private.key` + `public.key`) y **PostApi** (`public.key`).  
El Front **no** usa estas llaves.

**Gitignored:** no versionar `*.key` / `*.pem`.

## Generar (OpenSSL)

Desde esta carpeta (`BackEnd/certs`):

```bash
openssl genrsa -out private.rsa.pem 2048
openssl pkcs8 -topk8 -nocrypt -in private.rsa.pem -out private.key
openssl rsa -in private.rsa.pem -pubout -out public.key
rm private.rsa.pem
```

Docker Compose monta `BackEnd/certs` en Identity y `public.key` en PostApi.
