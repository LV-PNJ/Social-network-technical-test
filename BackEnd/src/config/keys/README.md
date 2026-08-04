# JWT public key (Posts API)

Only `public.key` is needed here (verification). Identity keeps `private.key`.

Generate from repo root:

```bash
# PowerShell
../scripts/generate-jwt-keys.ps1

# or openssl — see ../../certs/README.md
```

Docker Compose mounts `./certs/public.key` into this folder at runtime.
Do not commit `*.key` files.
