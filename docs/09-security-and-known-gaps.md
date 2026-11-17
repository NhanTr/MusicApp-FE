# Security and known implementation gaps

[Documentation index](README.md)

This is a source review baseline, not a penetration test or a claim about deployed exposure. Findings below describe the inspected working tree. Application code was not changed during documentation.

## Frontend audit status after redesign

The later frontend redesign resolves UI-01 (nested favorite normalization in rebuilt consumers), UI-02 (undefined history artist helper), MEDIA-02 (Song-ID auto-approval attempt), PLAY-01 (source reset on pause/resume), PLAY-02 (collection queue order), PLAY-03 (repeat modes), and PLAY-05 (fabricated fallback track). The tables below retain the original audit evidence; these listed items are historical rather than current defects. Backend findings remain open. See [current frontend contracts](14-frontend-redesign.md).

## Access and identity gaps

| ID | Observed behavior and evidence | Impact on future work |
| --- | --- | --- |
| AUTH-01 | UserController arbitrary-user update/status/delete paths require only authentication in SecurityConfig; UserServiceImpl has no admin check | Enforce intended permissions server-side before exposing more account controls |
| AUTH-02 | Upload list-all/approve/reject require only authentication; UploadServiceImpl has no admin check | A routed admin UI alone would not secure moderation |
| AUTH-03 | DELETE /api/songs/{id} is authenticated-only; SongServiceImpl.delete has no uploader/role check | Catalog deletion policy is broader than admin UI suggests |
| AUTH-04 | Access and refresh tokens have identical claims/verification except lifetime in JwtUtil | Endpoint-specific token use is not enforced; add a type/session design when changing auth |
| AUTH-05 | Frontend logout sends access token; backend blacklists supplied token only | Separate refresh token remains valid unless independently revoked |
| AUTH-06 | OTP login and refresh omit explicit banned-user check; JWT filter rejects banned users on later requests | Login/refresh response success differs from usable authenticated session |
| AUTH-07 | Redis blacklist lookup fails open and writes are swallowed | Redis outage can undermine revocation; OTP state may also fail silently |
| AUTH-08 | OTP verification has no attempt counter; generation uses ThreadLocalRandom | Define abuse controls and secure OTP generation when revising auth |
| AUTH-09 | Password update requires no old password; registration/user-update/password-update enforce different password limits | Make policy explicit across every path and define session revocation |
| AUTH-10 | Username is JWT subject and UserService can rename it without reissuing tokens | Rename can break subsequent token-to-user lookup |
| AUTH-11 | ProtectedRoute checks token presence only; AdminRoute is a browser check | Do not use client guards as an API security boundary |
| AUTH-12 | Fixed administrator bootstrap credentials and JWT/database/Redis development defaults exist in source | Replace bootstrap/default secret behavior in any deployment-hardening work |

## Contract and feature gaps

| ID | Observed behavior | Source / next investigation |
| --- | --- | --- |
| API-01 | authApi.updateProfile uses PUT /api/auth/me; backend exposes PUT /api/users/me | lib/api.js and UserController |
| API-02 | adminApi.getAdmins/createAdmin/deleteAdmin/updateAdminPassword have no backend mappings | lib/api.js and all inspected controllers |
| API-03 | AdminAccounts sends q/sort but AdminController reads page/size only | AdminAccounts and AdminController |
| API-04 | AdminSongs sends q to list endpoint; SongControlller.getSongs ignores q | Use dedicated search or extend server contract |
| API-05 | Artist albums endpoint returns a message object | Existing client correctly uses album artistId filter |
| API-06 | AppException codes 403/409/429 map to HTTP 400 | GlobalExceptionHandler |
| API-07 | PATCH user status exists but CORS allowed methods omit PATCH | CorsConfig; direct requests and cross-origin UI differ |
| API-08 | Playlist boolean Java/accessor/wire names may differ | Verify actual Jackson serialization before renaming public/isPublic |
| API-09 | Native accent search needs unaccent but root schema dump omits extension | Repositories and schema.sql |
| UI-01 | Several favorites consumers construct IDs from wrapper rows instead of row.song | SongsPage, History and other favorite initializers; normalize and verify each |
| UI-02 | History contains helper referring to artistApi while import is artistsApi; helper is not the main history fetch | History.jsx; assess invocation before assuming visible failure |
| UI-03 | Source has multiple legacy/unrouted admin pages and an unsupported admin-admin management page | AppRoutes.jsx is the route authority |
| UI-04 | No wildcard route registered | Define intentional not-found handling if routing changes |
| DATA-01 | Favorite addedAt generated at read time | Favorite entity lacks timestamp |
| DATA-02 | Album response songs/totals capped at 100 | AlbumServiceImpl.toResponse |
| DATA-03 | Global search playlist mapper reports songCount 0 and empty songs | MusicMapper overload; not authoritative membership |
| DATA-04 | Client sorts only fetched subsets and selectors use fixed result caps | SongsPage, useCatalogData, admin selectors |

## Upload and playback gaps

| ID | Observed behavior | Change consequence |
| --- | --- | --- |
| MEDIA-01 | Upload state is not consulted by catalog reads; media objects are public | Approval does not control visibility or direct URL access |
| MEDIA-02 | Upload form treats returned song ID as possible Upload ID and auto-approves | Response contract must identify the resource explicitly |
| MEDIA-03 | JSON song creation does not create an Upload record | A moderation policy must cover all creation paths |
| MEDIA-04 | Multipart bypasses JSON DTO validation, trusts MIME/original filename, accepts duration 0 | Browser accept attributes are not server content validation |
| MEDIA-05 | S3 writes and song/upload saves are not atomic; deletion leaves objects | Define cleanup/retry behavior and object lifecycle |
| MEDIA-06 | Public-read ACL upload depends on compatible bucket ownership/public-access configuration | AWS credentials alone do not prove upload will work |
| PLAY-01 | MusicPlay assigns src in an effect dependent on isPlaying | Pause/resume can reset playback; verify with actual media events |
| PLAY-02 | Parent active song rebuilds queue and resets index after selection/next/previous | Queue order may differ from the user's selected album/playlist |
| PLAY-03 | Repeat-none and repeat-all both advance/wrap | UI mode labels overstate behavior differences |
| PLAY-04 | Server counts song selection; local tracker checks playback position | Seeking can satisfy local threshold; local counts never reach backend |
| PLAY-05 | Provider substitutes hardcoded external track on fetch failure | Populated player does not prove API/catalog availability |

## Persistence and deployment gaps

- No versioned migration framework; production profile uses Hibernate update. SQL dump contains seed data and psql commands, not incremental changes.
- No declared entity cascade delete. SongService cleanup differs from AdminService raw delete; other resource deletions can encounter foreign-key failures.
- Response mapping can execute count/child queries per row; large page sizes and nested list payloads amplify database load.
- Generic exception messages are returned to clients. Ban/reject reasons are only logged, so they cannot support a reliable audit view.
- S3 client is mandatory for SongService and uses static credentials; empty credentials can stop startup rather than only disable upload.
- Dev Redis TLS conflicts with plain local Redis; dev hardcoded JWT values override common environment values.
- Backend Dockerfile healthcheck probes `/actuator/health`, but pom.xml has no Actuator starter and security does not publicly allow that endpoint.
- Nginx lacks an explicit client_max_body_size; container upload limits can be lower than Spring's 100 MB.
- Backend deployment YAML references `${{ id.login-ecr.outputs.registry }}` rather than the normal steps context. Verify/fix the workflow before relying on it; no deployment was attempted.
- Docker backend build skips tests. The repository has only a context smoke test; frontend has no test script. Deployment configuration is not evidence of deployed health.

## How to use these findings

Before changing a related feature, reproduce the relevant behavior on local test data, define intended behavior, implement the change across all creation/read/mutation paths, and add focused regression coverage. Close an item only after code and verification evidence support the updated contract. Avoid treating these source findings as proof that a particular deployed system is reachable or affected.
