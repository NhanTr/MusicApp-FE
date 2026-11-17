# Backend implementation guide

[Documentation index](README.md)

Base package: `nhantr.musicapp`. Entry point: [MusicappApplication.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/MusicappApplication.java).

## Package responsibilities

| Package | Role |
| --- | --- |
| `controller` | URL/method mappings, query defaults, request validation, response envelopes |
| `dto/request` | Input fields and Jakarta validation annotations |
| `dto/response` | Public representations; avoid exposing JPA entities directly |
| `service` | Interfaces and implementations, domain operations, identity, SMTP, Redis, S3 orchestration |
| `repository` | Spring Data JPA CRUD and explicit JPQL/native SQL |
| `entity` | Tables, IDs, relationships, enum persistence |
| `mapper` | User and music DTO conversion, including derived listener counts |
| `configuration` | Security chain, JWT filter, CORS, S3/Redis wiring, status initialization |
| `initialization` | Default administrator bootstrap |
| `exception`, `enums` | AppException, exception-to-response handling, error codes, role/status enums |
| `util` | JWT issuance/parsing/validation |

## Service responsibilities and side effects

| Service | Main behavior | Dependencies / caveats |
| --- | --- | --- |
| AuthServiceImpl | Registration OTP, registration, password/OTP login, refresh, logout, current user, password update | User DB, BCrypt, Redis, SMTP, JWT |
| CurrentUserServiceImpl | Resolve authentication name to User | Rejects missing/anonymous context; username is identity subject |
| UserServiceImpl | Self update, arbitrary user update/status/delete | Username uniqueness and optional password encoding; no admin assertion in arbitrary-user methods |
| SongServiceImpl | Catalog CRUD, search, trending, multipart uploads | S3 public writes; upload record creation; cleanup on delete |
| ArtistServiceImpl | Artist CRUD, songs, follower counts, optional follow state | Derived counts per artist; deletion does not detach relations |
| AlbumServiceImpl | Album CRUD, artist filter, embedded song list | First 100 songs used for totals |
| PlaylistServiceImpl | Own/public lists, private access, owner mutations, membership | Embedded songs, no ordering model |
| FavoriteServiceImpl | Own favorites, idempotent like, unlike, status | addedAt is generated at read time |
| FollowServiceImpl | Idempotent follow, unfollow, own followed page/status | Composite ID relation |
| HistoryServiceImpl | Append events, own search/list/delete/clear | No playback threshold or duplicate suppression |
| SearchServiceImpl | Search four resource groups | Public playlists only; arrays without page totals |
| UploadServiceImpl | Own/all lists, status transitions | No admin check or allowed-transition validation; reject reason logged only |
| AdminServiceImpl | User listing/details, ban/unban, raw song deletion, stats | `/api/admin/**` URL protection; different deletion path from SongService |
| RedisServiceImpl | OTP keys/cooldowns and token blacklist | Catches DataAccessException, logs, returns fallback values |
| EmailService | Registration/login OTP email | Requires SMTP delivery; inspect templates when changing email text |

## Security execution

`SecurityConfig` disables CSRF, enables CORS, configures stateless sessions, and installs `JwtAuthenticationFilter` before UsernamePasswordAuthenticationFilter. Password encoding is BCrypt. The filter checks blacklist, parses token subject, loads the current database user, rejects BANNED users, and sets `ROLE_<role>` authority. It does not use a role claim in the JWT.

URL rules permit all `/api/auth/**`, GET catalog/search routes, and GET `/api/playlists/public`. Specific admin and catalog mutations require ADMIN; other paths require authentication. `/api/auth/me` and update-password perform identity checks in services despite the public URL rule. See the [API reference](07-api-reference.md) for precise route classifications and the [security gaps](09-security-and-known-gaps.md) for missing role boundaries.

## Repositories and query portability

Song, artist, favorite, history, and playlist search use native PostgreSQL `unaccent(lower(...))` patterns with `%query%`. Album search uses case-insensitive JPQL without unaccent. Song search currently ignores its `type` argument. Trending orders by all-time history event count then creation time; it is not a rolling-window algorithm. Pagination uses PageRequest directly, with no common page-size cap or input normalization.

Response mapping incurs extra queries: each mapped song counts distinct history users; each playlist retrieves songs; each album retrieves up to 100 songs; each artist counts followers and songs and may resolve current user. Avoid increasing page sizes indiscriminately when performance changes are needed.

## Transactions and deletion

Explicit transactional methods include registration, history clear, unlike, unfollow, user/admin initialization, and the main SongService delete. Other multi-step workflows should not be assumed atomic. Song deletion bulk-deletes favorites, playlist memberships, history, and uploads before deleting the song; each cleanup catches exceptions, which may still leave a transaction rollback-only after a persistence failure. AdminService's separate song deletion directly calls repository deleteById without that cleanup.

Entities do not declare cascading removal. User/artist/album/playlist deletion can fail on related foreign keys. Define a deletion policy and migration before changing these workflows. No service deletes S3 media objects.

## Error and response behavior

Controllers wrap normal values in `APIResponse<T>` (`code`, `message`, `data`). Most successes are HTTP/application 200. Artist, album, playlist, and song create handlers set HTTP/application 201; registration remains 200.

`GlobalExceptionHandler` maps AppException code 401 to HTTP 401, 404 to 404, code >=500 to 500, and all other codes to HTTP 400. Therefore application codes 403, 409, and 429 do **not** currently produce matching HTTP statuses through this handler. Validation returns HTTP 400 with `message: Validation failed` and a field-message map in `data`. Unhandled exceptions return HTTP 500 containing `ex.getMessage()`. Security filter-chain denials can have a different response shape because they do not pass through normal MVC controller advice.

## Startup behavior

`AdminInitializer` creates a fixed default ADMIN if username admin is missing and logs its bootstrap password. `UserStatusInitializer` loads all users and sets null statuses to ACTIVE. Their execution order is not explicitly defined by the inspected classes. S3Config requires nonblank static access key, secret key, and region; SongService requires the resulting bean. Redis errors may be deferred until operations because the wrapper suppresses connection failures.
