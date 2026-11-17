# API reference

[Documentation index](README.md) · [DTO fields and validation](13-dto-reference.md)

## Common contract

Paths below are relative to the API origin, normally `http://localhost:8080` in local development. IDs are UUID strings. JSON writes use `Content-Type: application/json`. Authenticated calls use `Authorization: Bearer <access-token>`. Refresh is the exception: its Authorization header carries the refresh token. Multipart upload uses browser-generated multipart content type and boundary.

Normal envelope:

```json
{"code":200,"message":"Success","data":{"content":[],"totalElements":0,"totalPages":0,"page":0,"size":20}}
```

Paged results contain `content`, `totalElements`, `totalPages`, `page`, and `size`, with zero-based page numbering. Unless overridden below, paged endpoints default to page 0 and size 20. There is no controller-level maximum size or shared pagination validation. Search text parameter is `q`. Resource DTO fields are listed in [DTO reference](13-dto-reference.md).

Access labels describe **implemented backend checks**, not desired product policy:

- **Public**: allowed by URL security rules, no login needed for the described read/action.
- **User**: authentication required. Personal operations resolve current user, with owner checks where noted.
- **Admin**: ADMIN required by SecurityConfig URL rules.
- **Service identity**: `/api/auth/**` is URL-permitted, but the service checks current authentication.

## Authentication and self-service

Source: [AuthController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/AuthController.java).

| Method | Path | Access | Request | data / behavior |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register/send-otp` | Public | SendOtpRequest `{email}` | String confirmation; Redis + email |
| POST | `/api/auth/register` | Public | RegisterRequest `{username,email,password,otp}` | UserResponse, HTTP 200; not automatic login |
| POST | `/api/auth/login` | Public | LoginRequest `{username,password}` | LoginResponse; username also accepts email |
| POST | `/api/auth/login/send-otp` | Public | SendOtpRequest `{email}` | String confirmation; requires existing email |
| POST | `/api/auth/login/verify-otp` | Public | VerifyLoginOtpRequest `{email,otp}` | LoginResponse |
| POST | `/api/auth/logout` | Public URL + required header | Authorization Bearer token; no JSON body | Blacklists the supplied token only |
| POST | `/api/auth/refresh-token` | Public URL + required header | Authorization Bearer refresh token | RefreshTokenRespose with new access token |
| GET | `/api/auth/me` | Service identity | None | UserResponse |
| PUT | `/api/auth/update-password` | Service identity | `{newPassword,confirmNewPassword}` | String; no current password field |

LoginResponse fields are `accessToken`, `refreshToken`, `tokenType`, `expiresIn` (seconds), and `user`. Access and refresh JWTs currently differ only in expiry, not in token-type claims. Do not assume endpoint-level type enforcement. Password login blocks banned users; OTP verification and refresh do not explicitly repeat that check, although subsequent authenticated requests encounter the JWT filter's ban check.

There is **no `PUT /api/auth/me` mapping**. The client method with that path is inconsistent with UserController.

## User management

Source: [UserController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/UserController.java).

| Method | Path | Implemented access | Request | data |
| --- | --- | --- | --- | --- |
| PUT | `/api/users/me` | User, current account | UserUpdateRequest `{username?,password?}` | UserResponse |
| PUT | `/api/users/{id}` | User; missing admin-only enforcement | UserUpdateRequest | UserResponse |
| PATCH | `/api/users/{id}/status` | User; missing admin-only enforcement | Query `status=ACTIVE` or `BANNED` | UserResponse |
| DELETE | `/api/users/{id}` | User; missing admin-only enforcement | None | String |

Comments describe the arbitrary-user methods as admin actions, but SecurityConfig and UserServiceImpl do not enforce that. PATCH is also absent from the CORS allowed-method list, so browser cross-origin behavior differs from direct API access. UserUpdateRequest does not accept email/role/status updates; status uses the separate query endpoint.

## Songs

Source: [SongControlller](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/SongControlller.java); class spelling contains three `l` characters.

| Method | Path | Access | Query/body | data |
| --- | --- | --- | --- | --- |
| GET | `/api/songs` | Public | page, size, sort=`createdAt,desc` | PageResponse<SongResponse> |
| GET | `/api/songs/{id}` | Public | UUID path | SongResponse |
| GET | `/api/songs/search` | Public | Required q; type=`song`; page=0,size=10 | PageResponse<SongResponse>; type currently ignored |
| GET | `/api/songs/trending` | Public | page=0,size=10 | PageResponse<SongResponse> |
| POST | `/api/songs` JSON | User | SongRequest | SongResponse, HTTP 201; no upload record |
| POST | `/api/songs` multipart | User | Fields below | SongResponse, HTTP 201; auto-creates PENDING Upload |
| PUT | `/api/songs/{id}` | Admin | SongRequest | SongResponse |
| DELETE | `/api/songs/{id}` | User; no owner/admin check in service | UUID path | String; dependent rows cleaned before song deletion |

`GET /api/songs` does not read q, even though the client list helper sends it. Use `/search` for title/artist/album filtering. sort is split into property and asc/desc, without a property allowlist; invalid fields can fail at persistence time.

JSON SongRequest requires nonblank title/fileUrl, nonnull artistId, duration >=1, optional albumId and coverUrl. Multipart has different validation: required `fileSound` and `title` request params; optional `fileImage`, `artistId`, `albumId`; duration defaults to 0. It builds SongRequest programmatically without the JSON handler's `@Valid` validation. The service rejects empty audio but does not impose equivalent field/content validation.

```sh
curl -X POST http://localhost:8080/api/songs \
  -H 'Authorization: Bearer <access-token>' \
  -F 'fileSound=@/absolute/path/to/song.mp3' \
  -F 'fileImage=@/absolute/path/to/cover.jpg' \
  -F 'title=Example song' \
  -F 'duration=180'
```

## Artists

Source: [ArtistController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/ArtistController.java).

| Method | Path | Access | Input | data |
| --- | --- | --- | --- | --- |
| GET | `/api/artists` | Public | page,size,q default empty | PageResponse<ArtistResponse> |
| GET | `/api/artists/{id}` | Public | UUID | ArtistResponse |
| GET | `/api/artists/{id}/songs` | Public | page,size | PageResponse<SongResponse> |
| GET | `/api/artists/{id}/albums` | Public | UUID | `{artistId,message}` directing caller to album filter; not an album list |
| GET | `/api/artists/{id}/followers` | Public | UUID | `{followerCount: number}` |
| POST | `/api/artists` | Admin | ArtistRequest | ArtistResponse, HTTP 201 |
| PUT | `/api/artists/{id}` | Admin | ArtistRequest | ArtistResponse |
| DELETE | `/api/artists/{id}` | Admin | UUID | String |

## Albums

Source: [AlbumController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/AlbumController.java).

| Method | Path | Access | Input | data |
| --- | --- | --- | --- | --- |
| GET | `/api/albums` | Public | page,size,q default empty, optional artistId | PageResponse<AlbumResponse> |
| GET | `/api/albums/{id}` | Public | UUID | AlbumResponse |
| POST | `/api/albums` | Admin | AlbumRequest | AlbumResponse, HTTP 201 |
| PUT | `/api/albums/{id}` | Admin | AlbumRequest | AlbumResponse |
| DELETE | `/api/albums/{id}` | Admin | UUID | String |

AlbumResponse embeds at most 100 songs and computes totals from that subset. Use `/api/albums?artistId=<UUID>` for artist albums; the frontend helper correctly chooses that route rather than the artist albums placeholder.

## Playlists

Source: [PlaylistController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/PlaylistController.java).

| Method | Path | Access | Input | data |
| --- | --- | --- | --- | --- |
| GET | `/api/playlists` | User, own playlists | page,size,q | PageResponse<PlaylistResponse> |
| GET | `/api/playlists/public` | Public | page,size,q | PageResponse<PlaylistResponse> |
| GET | `/api/playlists/{id}` | User; public or owned private list | UUID | PlaylistResponse |
| POST | `/api/playlists` | User | CreatePlaylistRequest | PlaylistResponse, HTTP 201 |
| PUT | `/api/playlists/{id}` | Owner | UpdatePlaylistRequest | PlaylistResponse |
| DELETE | `/api/playlists/{id}` | Owner | UUID | String |
| POST | `/api/playlists/{id}/songs` | Owner | `{songId}` | String; duplicate membership is no-op |
| DELETE | `/api/playlists/{id}/songs/{songId}` | Owner | UUID paths | String |

Create/update request and response Java DTOs declare a primitive `boolean isPublic` field with Lombok accessors. The UI uses `public` and request.isPublic()/setPublic() in Java follows that accessor naming. Verify the effective Jackson wire property (`public` versus `isPublic`) with a real serialized request/response before changing the contract. A literal Java field name alone is not sufficient evidence for its JSON name. PlaylistResponse contains no owner ID, description, or cover field.

## Favorites, follows, and history

Sources: [FavoriteController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/FavoriteController.java), [FollowController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/FollowController.java), [HistoryController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/HistoryController.java).

All endpoints in this table require a user and act on that user's relationships.

| Method | Path | Input | data / effect |
| --- | --- | --- | --- |
| GET | `/api/favorites` | page,size,q | PageResponse<FavoriteResponse> with nested song |
| POST | `/api/favorites/{songId}` | None | String; idempotent like |
| DELETE | `/api/favorites/{songId}` | None | String; unlike |
| GET | `/api/favorites/{songId}/status` | None | `{liked: boolean}` |
| POST | `/api/follow/artists/{artistId}` | None | String; idempotent follow |
| DELETE | `/api/follow/artists/{artistId}` | None | String |
| GET | `/api/follow/artists` | page,size | PageResponse<ArtistSummaryResponse> |
| GET | `/api/follow/artists/{artistId}/status` | None | `{following: boolean}` |
| GET | `/api/history` | page,size,q | PageResponse<HistoryResponse>, latest first |
| POST | `/api/history` | `{songId}` | String; always appends new history row |
| DELETE | `/api/history` | None | String; clears current user's rows |
| DELETE | `/api/history/{id}` | History UUID | String; ownership enforced |

## Upload records

Source: [UploadController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/UploadController.java).

| Method | Path | Implemented access | Input | data |
| --- | --- | --- | --- | --- |
| GET | `/api/uploads/me` | User, own uploads | page,size | PageResponse<UploadResponse> |
| GET | `/api/uploads` | User; missing admin-only enforcement | optional status,page,size | PageResponse<UploadResponse> |
| PUT | `/api/uploads/{id}/approve` | User; missing admin-only enforcement | Upload UUID | String; sets APPROVED |
| PUT | `/api/uploads/{id}/reject` | User; missing admin-only enforcement | Upload UUID + `{reason}` | String; sets REJECTED; reason logged only |

There is no active POST `/api/uploads`; the service create method and UploadRequest remain but the controller directs uploads to multipart songs. Approval IDs are Upload IDs, not Song IDs. Status filter is uppercased; transitions do not validate the previous status. Song visibility is unaffected by status changes.

## Global search

GET `/api/search` is Public. Requires q; defaults page 0, size 10. Returns SearchResponse with `songs`, `artists`, `albums`, and `playlists` arrays. Each category applies the same page/size independently. There is no combined total or per-category pagination metadata. Playlist results are public only and mapped with empty songs and songCount 0.

## Administrative endpoints

Source: [AdminController](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/controller/AdminController.java). All require ADMIN through `/api/admin/**` URL security.

| Method | Path | Input | data |
| --- | --- | --- | --- |
| GET | `/api/admin/users` | page,size only | PageResponse<UserAdminResponse>; ignores client q/sort |
| GET | `/api/admin/users/{id}` | UUID | UserAdminResponse |
| PUT | `/api/admin/users/{id}/ban` | `{reason}` required nonblank | String; sets BANNED; reason logged only |
| PUT | `/api/admin/users/{id}/unban` | UUID | String; sets ACTIVE |
| DELETE | `/api/admin/songs/{id}` | UUID | String; direct repository delete, different cleanup from song endpoint |
| GET | `/api/admin/stats` | None | StatsResponse |

No backend controller implements `/api/admin/admins`, its ID variant, or its password variant despite client helpers for those paths.

## Error interpretation and examples

Validation example:

```json
{"code":400,"message":"Validation failed","data":{"title":"title is required"}}
```

AppException code and HTTP status differ for 403/409/429: the current handler sends HTTP 400 with those application codes. Handle both `.status` and `.data.code` when investigating failures. Filter-generated security errors may not use this envelope. Generic exception messages are exposed through HTTP 500. This reference describes the current mapping, not an ideal REST status policy.
