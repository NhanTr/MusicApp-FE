# Project overview

[Documentation index](README.md)

## Product and actors

MusicFlow is a browser music application with a Vietnamese-oriented interface. Users discover songs, artists, and albums; play audio; manage personal playlists and favorites; review listening history; upload audio; and update their password. Administrators use a separate workspace for catalog and account management.

The backend defines `USER`, `CREATOR`, and `ADMIN` roles. Registration always creates `USER`. There is no separate creator registration or creator-specific route guard in the inspected implementation. Account status is `ACTIVE` or `BANNED`.

## Technology baseline

| Layer | Declared implementation |
| --- | --- |
| Browser app | React `^19.2.4`, React Router DOM `^7.14.1`, JSX with shared TSX UI components |
| Frontend build | Vite `^8.0.4`, React Vite plugin `^6.0.1`, npm lockfile |
| UI | Tailwind CSS `^4.2.2`, Radix primitives, Lucide icons, Sonner toasts; additional UI library dependencies in package.json |
| API runtime | Java 21, Spring Boot 4.0.6, Maven wrapper |
| API libraries | Spring MVC, Security, Validation, Data JPA, Data Redis, Mail, Lombok |
| Token library | JJWT 0.12.6 |
| Media storage | AWS SDK S3 2.25.0, public object URLs |
| Relational storage | PostgreSQL; Docker uses `postgres:16-alpine` |
| Temporary auth storage | Redis; Docker uses `redis:7-alpine` |
| Email | SMTP through Spring Mail, Gmail host default |
| Container UI serving | Nginx 1.27 Alpine; Node 22 Alpine frontend build stage |
| Hosting configuration | Vercel rewrites for frontend; backend GitHub Actions targets AWS ECR/ECS |

H2 is a runtime dependency and old H2 database files exist under backend `data/`, but the current default, dev, and prod YAML configure PostgreSQL. H2 is not a verified drop-in development database because search uses PostgreSQL-specific functions.

## Workspace layout

```text
PlayerMussic/
  docs/                        This documentation set
  USECASES.md                  Earlier use-case notes
  docker-compose.yml           Root full-stack orchestration
  frontend_MussicApp/           Independent frontend Git repository
    src/routes/                Actual client route registrations
    src/features/              User-facing feature pages
    src/pages/admin/           Routed and legacy admin pages
    src/components/            Shared layout, player, guards, UI primitives
    src/contexts/              Music state provider
    src/hooks/                 Catalog and listen tracking hooks
    src/lib/                   HTTP helpers and song normalization
  backend_MusicApp/             Independent backend Git repository
    src/main/java/nhantr/musicapp/
      controller/ service/ repository/ entity/ dto/ mapper/
      configuration/ initialization/ exception/ enums/ util/
    src/main/resources/        Profiles and SQL files
    src/test/                  One Spring context smoke test
    .github/workflows/         Backend deployment workflow
  template/screenshots/        Reference assets, outside application runtime
```

Generated `dist/`, `target/`, and `node_modules/` are not the source of truth for features. The root `.github` Java upgrade hook files are tooling artifacts rather than an application CI pipeline.

## Feature status

| Area | Current availability | Important limit |
| --- | --- | --- |
| Password login | Routed UI and API | UI input is email although API accepts username or email |
| OTP login and registration | Routed UI and API | Redis and SMTP required; OTP login lacks the password flow's explicit ban check |
| Catalog browsing and search | Routed UI and API | PostgreSQL `unaccent` required for several searches |
| Audio playback | Shared player on `/music/*` | Queue, repeat, source effects, and listen metrics need care when changing |
| Favorites and history | Routed UI and API | Some pages misread nested favorite responses |
| Playlists | Personal/public listing, creation, detail, deletion, playback; API also supports update/remove-song | No stored ordering, description, or collaborator model |
| Artist following | Backend and artist UI integration | Separate from the player or favorites state |
| Upload | Routed user form and admin song upload | Pending status does not hide a song from public reads |
| Admin catalog/accounts | Four registered admin subroutes | Account/song search parameters are sent but ignored by relevant list controllers |
| Upload review UI | Source page exists | `UploadsAdmin.jsx` is not registered in AppRoutes |
| Admin account creation | Client helpers and source page exist | No matching `/api/admin/admins` backend controller; page is unrouted |
| Profile editing | API `/api/users/me` exists | `authApi.updateProfile` points at missing `PUT /api/auth/me`; current Profile focuses on password |
| Automated testing | Backend context smoke test | No frontend test script or feature-level backend suite |

See [known gaps](09-security-and-known-gaps.md) before treating UI labels or earlier use-case descriptions as guarantees.
