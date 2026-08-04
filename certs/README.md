# JWT RSA keys (RS256)

Identity firma con `private.key` (PKCS#8).  
Posts API verifica con `public.key` (SPKI / X.509 PEM).

**These files are gitignored. Do not commit them.**

## Generate (recommended)

From repo root:

```powershell
.\scripts\generate-jwt-keys.ps1
```

Or manually:

```bash
openssl genrsa -out private.rsa.pem 2048
openssl pkcs8 -topk8 -nocrypt -in private.rsa.pem -out private.key
openssl rsa -in private.rsa.pem -pubout -out public.key
rm private.rsa.pem
```

Docker Compose mounts `./certs` into Identity and `public.key` into Posts.
