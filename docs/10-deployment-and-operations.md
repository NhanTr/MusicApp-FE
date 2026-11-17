# Deployment and operations

[Documentation index](README.md)

## Root full-stack Compose

[docker-compose.yml](../workspace/docker-compose.yml) defines postgres, redis, backend, frontend, and an optional db-import tool. Database/cache have health checks; backend waits for both; frontend depends on backend start, not an application readiness check. Named volumes persist relational data and Redis data.

After configuring a local-only backend `.env` and choosing a fresh test database safely:

```sh
docker compose up --build -d
docker compose ps
docker compose logs --tail=100 backend frontend
```

Frontend is exposed on localhost:3000; API on localhost:8080. Root Compose sets backend DB_HOST=postgres and REDIS_HOST=redis. Its fixed local database/cache credentials must agree with the effective backend environment. Do not assume all values from a deployment `.env` are appropriate for this stack.

`db-import` is tools-profile only and explicitly drops/recreates the public schema before importing the dump. It destroys existing schema content. It is not part of ordinary startup and is not a migration command. `docker compose down` stops/removes containers while preserving named volumes; adding volume removal is a separate destructive action.

## Alternative backend Compose files

Backend `compose.yaml` and `compose.dev.yml` are separate orchestration options with different container names, volume/network names, and interpolation. The main backend service in compose.yaml is commented out. compose.dev.yml runs PostgreSQL/Redis for a locally launched API. Do not start these together with the root stack on the same host ports without checking collisions. Spring Docker Compose integration is disabled in checked-in YAML, so `./mvnw spring-boot:run` does not automatically establish this infrastructure.

## Container builds

Frontend uses a Node 22 Alpine build stage (`npm ci`, `npm run build`) and copies dist into Nginx. Backend uses Maven/Temurin 21 to package with tests skipped and Temurin 21 JRE Alpine to run the jar as a non-root user. Neither image proves runtime credentials/services are correctly configured.

The backend image healthcheck calls `/actuator/health`, but the source has no Actuator starter or public health security rule. Expect to investigate unhealthy status independently from whether catalog requests work; choose and implement a real health endpoint before using this probe for availability decisions.

## Frontend API routing

| Mode | Browser request destination | Server forwarding |
| --- | --- | --- |
| Vite, empty VITE_BACKEND_URL | Relative /api path on dev origin | Vite proxy → localhost:8080 unless shell variable overrides |
| Root Docker, relative URLs | Relative /api path on port 3000 | Nginx → backend:8080/api/ |
| Vercel, relative URLs | Relative /api on frontend domain | vercel.json → configured DuckDNS HTTPS API host |
| Nonempty VITE_BACKEND_URL | Absolute browser URL baked into bundle | Bypasses relative proxy/rewrite; backend CORS must allow frontend origin |

Nginx and Vercel both supply SPA fallback so deep client URLs resolve to index.html. Confirm unknown `/api` requests still reach the API rather than accidentally receiving HTML. Browser errors reading HTML as JSON often signal routing/base-URL mistakes.

Nginx config does not explicitly increase request body size. Large multipart files may receive HTTP 413 from the proxy before reaching Spring. Set proxy and backend limits coherently if changing upload capacity. API and media requests are separate: audio/cover reads go directly to S3 URLs and depend on object permissions and browser compatibility.

## Backend deployment workflow

`backend_MusicApp/.github/workflows/deploy.yml` triggers on main pushes, configures AWS credentials from GitHub secrets, logs in to ECR, builds/tags/pushes a backend image, downloads an existing ECS task definition, replaces its image, and deploys to an existing ECS service/cluster. It assumes those AWS resources and IAM permissions already exist; it does not provision them.

The ECR registry expression currently uses `id.login-ecr.outputs.registry`, a source-level issue to verify against the steps output context. There is no explicit test stage before deployment, and Docker packaging skips tests. Do not treat this file as a verified deployment pipeline. Frontend Vercel deployment automation is not described beyond the checked-in rewrites; no live hosting settings were inspected.

## Operational data and backups

- Back up PostgreSQL before schema or destructive account/catalog changes. Test restoration into a separate database using a compatible PostgreSQL client.
- Keep S3 media lifecycle separate from database backups; database URLs alone are not a copy of objects.
- Redis loss invalidates pending OTP/cooldowns and removes the blacklist. Loss of blacklist has different security consequences from loss of disposable cache data.
- The checked-in dump contains data. Do not duplicate its rows or password hashes into documentation, fixtures, or public diagnostics.
- Avoid printing `.env`, real tokens, SMTP credentials, or AWS keys during troubleshooting. Configuration variable names and sanitized connection destinations are usually enough.

## Troubleshooting map

| Symptom | Inspect first |
| --- | --- |
| API fails at startup with S3 properties/bean failure | Effective AWS env, nonblank region/keys, S3Config and mandatory SongService dependency |
| PostgreSQL connection refused | Container health, host versus container address, DB_PORT and SSL mode |
| Search errors mentioning unaccent | Extension installed in the actual selected database |
| Redis auth/TLS errors | Password agreement, dev profile ssl.enabled, plain local container |
| OTP sent but verification says expired | Redis write/read failure, email normalization, five-minute TTL, selected environment |
| OTP resend appears throttled after mail error | Keys written before SMTP delivery; cooldown lasts one minute |
| Browser CORS failure | Exact origin allowlist, PATCH omission, absolute VITE_BACKEND_URL |
| `/music/...` deep links fail | SPA fallback at actual host |
| Admin/song search does not filter | Controllers ignore q/sort on relevant list routes |
| Upload 413 | Nginx/reverse proxy body limit before Spring multipart limits |
| S3 ACL/AccessDenied upload error | Bucket ownership/public-access policy and IAM permissions |
| Upload success but approve fails | Song UUID used instead of Upload UUID |
| Container unhealthy while API responds | Unsupported Actuator probe in Dockerfile |
| Token refresh never runs | Response status must be HTTP 401 and helper call must have auth enabled |
| Playback resumes at beginning | MusicPlay src effect depends on isPlaying |
| Delete fails with FK violation | No cascade and inconsistent dependent-row cleanup |

These are investigation starting points derived from source; no live outage was reproduced during documentation.
