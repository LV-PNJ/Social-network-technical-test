# JWT RSA keys (RS256)

Identity firma con `private.key` (PKCS#8).  
Posts API verifica con `public.key` (X.509).

## Generar par local

```bash
openssl genrsa -out private.key 2048
openssl rsa -in private.key -pubout -out public.key
# Convertir a PKCS#8 si openssl generó PKCS#1:
openssl pkcs8 -topk8 -nocrypt -in private.key -out private.pkcs8.key
mv private.pkcs8.key private.key
```

Copiar también a:
- `BackEnd/src/config/keys/`
- `services/identity-service/src/main/resources/certs/` (solo para demos locales)

No versionar las llaves reales (ver `.gitignore`).
