# Setup and configuration

[Documentation index](README.md)

## Prerequisites and boundaries

Use Java 21, Docker with Compose v2, and a Node release supported by the installed Vite version. The checked-in frontend Dockerfile uses Node 22 Alpine; verify your local version against the installed package's `engines`. The backend includes Maven wrapper scripts. PostgreSQL, Redis, S3 client configuration, and SMTP are separate dependencies; SMTP is needed to complete OTP flows. An unconditional `S3Client` constructor dependency means omitting AWS credentials can prevent backend startup even if you do not intend to upload.

Configuration examples below use placeholders. Existing private `.env` values were not reviewed or copied into docs. Before starting anything, ensure the selected configuration points at a disposable local database rather than a shared deployment.

## Recommended local sequence

From workspace root, start only infrastructure using the root Compose file:

```sh
docker compose up -d postgres redis
docker compose ps
```

On first creation of the PostgreSQL volume, root Compose imports `src/main/resources/schema.sql`. That file is a database dump with data, not a clean versioned migration. Existing volumes skip initialization scripts. Inspect whether its seed content is appropriate before using it. If you need an empty database, provision a separate local database/volume deliberately; do not reset an existing volume as part of ordinary setup.

Enable accent-insensitive search in the selected local database; the root-mounted dump does not create `unaccent`:

```sh
docker compose exec postgres psql -U app_user -d SoundCloudDB -c 'CREATE EXTENSION IF NOT EXISTS unaccent;'
```

Configure `backend_MusicApp/.env` using its YAML variables. Spring imports `.env` as a properties file relative to its working directory, so run the backend inside that directory:

```sh
cd backend_MusicApp
./mvnw spring-boot:run
```

Prefer the default profile for the root Compose Redis service. The `dev` profile enables Redis TLS while the local Redis container uses plain TCP. Backend `.env.local` is not imported by the checked-in Spring config.

In another terminal, from the frontend directory:

```sh
cd frontend_MussicApp
npm ci
npm run dev
```

Vite ordinarily serves port 5173; check its startup output if the port is occupied. Set `VITE_BACKEND_URL=http://localhost:8080` in frontend `.env.local` for direct browser API calls, or leave it empty to use relative `/api` paths through the development proxy. Vite loads `.env.local` and uses build-time environment values in browser code. Its config reads `process.env.VITE_BACKEND_URL` for the proxy target, which is not the same mechanism as `import.meta.env`; absent a shell variable, the proxy falls back to localhost:8080.

## Environment variable reference

| Variable | Purpose / source behavior |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | Defaults to `default`; `dev` and `prod` YAML override common config |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | JDBC destination; defaults localhost, 5432, SoundCloudDB |
| `DB_USERNAME`, `DB_PASSWORD` | Database credentials; local defaults are present in YAML/Compose |
| `DB_SSLMODE` | JDBC `sslmode`; common default `disable` |
| `DB_DRIVER` | Override supported in dev profile only |
| `JPA_DDL_AUTO` | Common config defaults `update`; dev/prod hardcode `update` |
| `JPA_SHOW_SQL` | Common default false; dev true; prod false |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection; password defaults differ in prod |
| `MAIL_HOST`, `MAIL_PORT` | SMTP default smtp.gmail.com:587 |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP identity/credential; blank defaults |
| `JWT_SECRET` | HMAC secret in default/prod; supply a private sufficiently long key |
| `JWT_EXPIRATION_MS` | Common/prod access lifetime default 3,600,000 ms |
| `JWT_REFRESH_EXPIRATION_MS` | Common/prod refresh lifetime default 604,800,000 ms |
| `AWS_S3_BUCKET_NAME` | Storage bucket name |
| `AWS_REGION` | S3 region, default ap-southeast-1 |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Used by static S3 credential provider; blank values fail bean creation |
| `VITE_BACKEND_URL` | Browser API base URL; empty means relative URLs |

`application-dev.yml` hardcodes its JWT secret and lifetimes (900,000 ms access and 604,800,000 ms refresh), overriding the common environment placeholders. It also hardcodes DDL update and SQL logging. `application-prod.yml` hardcodes DDL update, disables SQL logging, and sets Hikari maximum pool 10, minimum idle 2, connection timeout 10 seconds; Redis timeout is 5 seconds. Common multipart limits are 100 MB per file and per request, so audio plus cover must fit the total request limit.

## Ports and network addresses

| Service | Host development address | Root Compose container address |
| --- | --- | --- |
| Frontend Vite | localhost:5173 normally | Not used by root full-stack frontend |
| Frontend Nginx | localhost:3000 | frontend:80 |
| API | localhost:8080 | backend:8080 |
| PostgreSQL | localhost:5432 | postgres:5432 |
| Redis | localhost:6379 | redis:6379 |

Root Compose overrides `DB_HOST` and `REDIS_HOST` for backend container networking. Do not use `localhost` to reach another container. Other values still come from the backend `.env` and may need explicit local overrides.

## First verification

```sh
curl -i 'http://localhost:8080/api/songs?page=0&size=1'
```

Check for HTTP 200 and the API envelope with paged `data.content`. Then test login with an existing local test user. Registration requires functioning Redis and SMTP. A seeded administrator may exist; `AdminInitializer` also creates a fixed default administrator if username `admin` is absent. Its credentials are in source and logged on creation; treat that as a development bootstrap mechanism and replace it before deployment.

Setup instructions are source-derived and were not executed against a live service during this documentation task.
