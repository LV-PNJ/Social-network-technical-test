# Secrets management — DEVEXP

## Rule

No secrets in the Git repository. Use environment variables, mounted files, or equivalent.

## What must stay out of Git

| Item | Mechanism |
|------|-----------|
| DB credentials | Root `.env` (from `.env.example`) → Compose / JDBC |
| JWT **private** key | `./certs/private.key` mounted only into Identity |
| JWT **public** key | `./certs/public.key` mounted into Identity + Posts |
| Service `.env` | `BackEnd/.env`, `FrontEnd/.../.env` (examples only in repo) |

## First-time setup

```powershell
cp .env.example .env
# Edit POSTGRES_PASSWORD (and related) in .env

.\scripts\generate-jwt-keys.ps1
docker compose up -d --build
```

`.env.example` and `*.example` contain placeholders (`change-me`), never real passwords.

## Runtime wiring

- **Compose** reads `.env` and injects `DB_*` / `JWT_*` / `MQTT_*`.
- **Identity** loads PEM via `JWT_PRIVATE_KEY_LOCATION` / `JWT_PUBLIC_KEY_LOCATION` (`file:/app/certs/...`).
- **Posts** verifies with the mounted public key (or `JWT_PUBLIC_KEY` / `JWT_PUBLIC_KEY_PATH`).
- Keys under `certs/` and `**/resources/certs/*.key` are **gitignored**.

## Demo user (not a deploy secret)

Seeded account `demo` / `Demo123!` is a documented demo credential for the technical test, not infrastructure secret material.

## Checklist before push

```bash
git status   # no .env, no *.key
git ls-files | findstr /i ".env .key .pem"
# Should only list *.example and certs/README.md (docs), not real secrets
```
