# Testing and future feature changes

[Documentation index](README.md)

## Current frontend verification

The redesign adds `npm test` (queue unit tests) and `npm run test:e2e` (Playwright responsive/interactions suite), alongside build/lint. See [redesign verification](14-frontend-redesign.md). The original baseline below is retained as historical context. Backend test coverage remains unchanged.

## Original verification capabilities

Frontend package scripts are dev, build, lint, and preview; there is no unit/component/E2E test script. Build uses Vite without a standalone TypeScript compiler step. Backend contains one SpringBootTest contextLoads test and no inspected feature-level tests. That test initializes application beans and may require database, Redis, S3 configuration, and startup initializers; it is not an isolated unit test.

Commands to run after relevant implementation changes:

```sh
# From frontend_MussicApp
npm run build
npm run lint

# From backend_MusicApp, with disposable test infrastructure configured
./mvnw test
./mvnw package -DskipTests
```

The last command checks packaging but deliberately does not validate tests. Never describe a skipped-test build as a passing test suite. Existing lint/type issues should be recorded separately from issues introduced by a change. No application build/test success is claimed by this documentation-only task.

## Feature-to-file change map

Paths below are relative to frontend `src/` (FE) and backend `src/main/java/nhantr/musicapp/` (BE).

| Change | FE starting points | BE starting points | Additional contracts |
| --- | --- | --- | --- |
| Login or registration | features/auth/*, lib/api.js, guards | controller/AuthController, service/AuthServiceImpl, util/JwtUtil, JWT filter | Auth DTOs, Redis keys, SMTP, banned state, storage/logout |
| Profile/username/password | features/profile/Profile, lib/api.js | UserController, AuthController, UserServiceImpl, AuthServiceImpl | JWT subject rename, consistent password policy, missing client path |
| New music route | routes/AppRoutes, pages/music/MusicLayout, SidebarApp | Corresponding controller/service if new data | Guards, deep links, not-found behavior, layout persistence |
| Playback/queue/repeat | components/MusicPlay, contexts/MusicContext, hooks/useListenTracker | HistoryServiceImpl if count contract changes | Selection vs elapsed-play metric, seeking, next/previous, queue reset |
| Favorites | LikeButton, favorites/Favorites, every liked-ID initializer, song-utils | FavoriteController/ServiceImpl/Repository/entity | Nested song response, timestamp persistence, idempotency |
| History/analytics | history/History, MusicContext, useListenTracker, dashboard | HistoryServiceImpl, ListeningHistoryRepository, SongRepository, MusicMapper | Distinct users vs rows, deletion effects, deduplication |
| Search/pagination/sorting | usePagedSearch, songs/artist/album/search pages, admin lists | Controllers, list/search services, repository queries | q/type/sort support, unaccent, totals and database ordering |
| Artist/album fields | features/artists, features/albums, AdminArtists/AdminAlbums | Artist/Album DTO/entity/service/repository | Summary DTOs, selectors, detail/list payloads, related song relations |
| Playlist behavior | playlists/Playlists, MusicPlay add dialog | PlaylistController/ServiceImpl/Repository, PlaylistSong | public wire name, ownership, ordering schema, delete cleanup |
| Upload/moderation | upload/Upload, AdminSongs, unrouted UploadsAdmin, routes/nav | SongServiceImpl, UploadServiceImpl, SecurityConfig, S3Config | Song vs Upload IDs, all creation paths, visibility, ACL, atomic cleanup |
| Admin permissions/accounts | AdminRoute, AdminAccounts, AdminLayout | SecurityConfig, AdminController, UserController, UserServiceImpl | User vs ADMIN API checks, q/sort, self-ban/delete policy |
| Deployment/config | Vite config, nginx.conf, vercel.json, FE Dockerfile | YAML profiles, BE Dockerfile, workflow | Build-time frontend env, CORS, healthcheck, migration/secret behavior |

## Change planning template

Before implementing a feature change, record:

1. **Current behavior:** the relevant route, payload, state owner, database fields, and known gaps.
2. **Desired behavior:** concrete user action and visible outcome, including empty/error/forbidden states.
3. **API contract:** new/changed paths, DTO validation, response shape, status mapping, pagination and compatibility.
4. **Authorization:** anonymous, user, owner, creator, admin; enforce it on the server.
5. **Persistence:** fields, constraints, backfill, indexes, delete policy, migration and rollback strategy.
6. **Side effects:** S3, mail, Redis, retries, partial failure, and cleanup.
7. **Verification:** focused cases that demonstrate the behavior plus affected workflows below.
8. **Documentation:** update feature, API, database/DTO, known gaps and configuration as applicable.

For an additive response field, keep old consumers working, add the entity/migration if persisted, populate it in every mapper path, then adopt it in the UI. For a renamed or removed field, identify all consumers before changing the server. Summary DTOs and global search results often have fewer fields than detail DTOs.

## Manual regression checklist

Use two regular accounts, one administrator, at least two artists/albums, a private/public/non-empty playlist, an uploaded track, and disposable media. Keep this isolated from shared/production data.

| Area | Cases and evidence to inspect |
| --- | --- |
| Registration | Valid/expired/wrong OTP; duplicate username/email; resend cooldown; SMTP/Redis failure; stored role/status |
| Login/auth | Password username/email behavior, OTP, ban/unban, expired access refresh, concurrent 401s, logout revocation, refresh token misuse |
| Access control | Direct HTTP attempts as anonymous/user/owner/other-user/admin, especially user mutations, song delete, upload moderation |
| Catalog/search | Empty list, accent/case/whitespace, multi-page results, invalid ID, invalid size/sort, artist filter, client sorting scope |
| Playback | Initial selection, select while paused/playing, pause/resume position, seek, next/previous order, shuffle, repeat-one/none/all, ended event, broken URL |
| Navigation | Deep link reload, music-route persistence, leave/re-enter music layout, admin denial, logout redirect |
| Favorites | Like/unlike from each page, nested response normalization, refresh/navigation consistency, repeated/concurrent actions |
| History | Selection without play, initial load, repeated selections, delete own/other event, clear; observe listener/trending changes |
| Playlists | Visibility serialization, public/private access, create/update, duplicate membership, remove, non-empty delete, play selection queue |
| Upload | Optional cover, missing/empty audio, combined size limit, wrong content, zero duration, S3 error, partial failure, record IDs, status transition/visibility |
| Admin | Catalog CRUD with dependent records, account list/search/sort, ban reason requirements, non-admin direct API checks |
| Deployment | API routing, SPA fallback, CORS/PATCH, actual readiness probe, startup credentials, database extension, proxy upload limits |

## Testing priorities for later implementation

Add focused tests where behavior is changed, particularly service ownership/role checks, auth token separation and revocation, mapper response shape, and PostgreSQL search queries. Native unaccent queries need PostgreSQL integration coverage; an H2-only context test cannot establish their correctness. Player changes benefit from browser tests asserting the actual audio element source/time/state and queue order. Avoid tests that only repeat button labels or mirror implementation details.

## Documentation verification

For documentation-only edits, verify relative links resolve, route tables match controller annotations/AppRoutes, each DTO appears in the field reference, and source inventory covers maintained runtime/config files. Recheck that examples contain placeholders rather than private credentials. Do not start services or perform external writes merely to validate Markdown.
