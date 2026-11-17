# DTO field reference

[Documentation index](README.md) · [API endpoint reference](07-api-reference.md)

Extracted from the inspected Java request/response classes on 2026-11-17. These are Java field declarations; Jackson/Lombok accessor naming can affect JSON names, especially primitive `isPublic`. A DTO existing here does not prove it is bound to an active endpoint. See the API reference for actual use. UUID values serialize as strings, LocalDate as date values, and LocalDateTime as date-time values under normal Spring JSON configuration; no custom date serialization contract was found.

## Request DTOs

### AlbumRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/AlbumRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `name` | `String` | `@NotBlank(message = "name is required")` |
| `artistId` | `UUID` | `@NotNull(message = "artistId is required")` |
| `releaseDate` | `LocalDate` | None on field |
| `coverUrl` | `String` | None on field |

### ArtistRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/ArtistRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `name` | `String` | `@NotBlank(message = "name is required")` |
| `bio` | `String` | None on field |
| `avatarUrl` | `String` | None on field |

### BanUserRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/BanUserRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `reason` | `String` | `@NotBlank(message = "reason is required")` |

### CreatePlaylistRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/CreatePlaylistRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `name` | `String` | `@NotBlank(message = "name is required")` |
| `isPublic` | `boolean` | None on field |

Verify actual `public` versus `isPublic` wire naming before changing consumers; this table preserves the Java declaration.

### HistoryRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/HistoryRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `songId` | `UUID` | `@NotNull(message = "songId is required")` |

### LoginRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/LoginRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `username` | `String` | `@NotBlank(message = "Username is required")` |
| `password` | `String` | `@NotBlank(message = "Password is required")` |

### LogoutRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/LogoutRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `refreshToken` | `String` | None on field |

This DTO is not bound by logout: the active controller reads the Authorization header.

### PlaylistSongRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/PlaylistSongRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `songId` | `UUID` | `@NotNull(message = "songId is required")` |

### RegisterRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/RegisterRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `username` | `String` | `@NotBlank(message = "Username is required")`<br>`@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")` |
| `email` | `String` | `@NotBlank(message = "Email is required")`<br>`@Email(message = "Email is invalid")` |
| `password` | `String` | `@NotBlank(message = "Password is required")`<br>`@Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")` |
| `otp` | `String` | `@NotBlank(message = "OTP is required")`<br>`@Size(min = 6, max = 6, message = "OTP must have exactly 6 digits")` |

### RejectUploadRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/RejectUploadRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `reason` | `String` | `@NotBlank(message = "reason is required")` |

### SendOtpRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/SendOtpRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `email` | `String` | `@NotBlank(message = "Email is required")`<br>`@Email(message = "Email is invalid")` |

### SongRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/SongRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `title` | `String` | `@NotBlank(message = "title is required")` |
| `artistId` | `UUID` | `@NotNull(message = "artistId is required")` |
| `albumId` | `UUID` | None on field |
| `duration` | `int` | `@Min(value = 1, message = "duration must be > 0")` |
| `fileUrl` | `String` | `@NotBlank(message = "fileUrl is required")` |
| `coverUrl` | `String` | None on field |

Validation applies to JSON controller binding. Multipart creation builds this object manually and does not run the same @Valid path.

### UpdatePasswordRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UpdatePasswordRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `newPassword` | `String` | `@NotBlank(message = "newPassword is required")` |
| `confirmNewPassword` | `String` | `@NotBlank(message = "confirmNewPassword is required")` |

### UpdatePlaylistRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UpdatePlaylistRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `name` | `String` | `@NotBlank(message = "name is required")` |
| `isPublic` | `boolean` | None on field |

Verify actual `public` versus `isPublic` wire naming before changing consumers; this table preserves the Java declaration.

### UploadRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UploadRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `songId` | `UUID` | None on field |

A service create method accepts this DTO, but no active POST upload-record controller mapping exposes it. Multipart song creation is the active upload path.

### UserUpdateRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/UserUpdateRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `username` | `String` | `@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")` |
| `password` | `String` | `@Size(min = 8, message = "Password must be at least 8 characters")` |

### VerifyLoginOtpRequest

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/request/VerifyLoginOtpRequest.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `email` | `String` | `@NotBlank(message = "Email is required")`<br>`@Email(message = "Email is invalid")` |
| `otp` | `String` | `@NotBlank(message = "OTP is required")`<br>`@Size(min = 6, max = 6, message = "OTP must have exactly 6 digits")` |

## Response DTOs

### APIResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/APIResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `code` | `int` | None on field |
| `message` | `String` | None on field |
| `data` | `T` | None on field |

`success` defaults to code 200/message Success; `error` sets code/message and leaves data unset/null according to serialization configuration.

### AlbumResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/AlbumResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `name` | `String` | None on field |
| `releaseDate` | `LocalDate` | None on field |
| `coverUrl` | `String` | None on field |
| `artist` | `ArtistSummaryResponse` | None on field |
| `songs` | `List<SongResponse>` | None on field |
| `totalSongs` | `int` | None on field |
| `totalDuration` | `int` | None on field |

### AlbumSummaryResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/AlbumSummaryResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `name` | `String` | None on field |

### ArtistResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/ArtistResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `name` | `String` | None on field |
| `bio` | `String` | None on field |
| `avatarUrl` | `String` | None on field |
| `followerCount` | `long` | None on field |
| `songCount` | `long` | None on field |
| `isFollowing` | `Boolean` | None on field |
| `createdAt` | `LocalDateTime` | None on field |

### ArtistSummaryResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/ArtistSummaryResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `name` | `String` | None on field |

### FavoriteResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/FavoriteResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `song` | `SongResponse` | None on field |
| `addedAt` | `LocalDateTime` | None on field |

### HistoryResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/HistoryResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `song` | `SongResponse` | None on field |
| `listenedAt` | `LocalDateTime` | None on field |

### LoginResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/LoginResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `accessToken` | `String` | None on field |
| `refreshToken` | `String` | None on field |
| `tokenType` | `String` | None on field |
| `expiresIn` | `long` | None on field |
| `user` | `UserResponse` | None on field |

### PageResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/PageResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `content` | `List<T>` | None on field |
| `totalElements` | `long` | None on field |
| `totalPages` | `int` | None on field |
| `page` | `int` | None on field |
| `size` | `int` | None on field |

`fromPage` copies content and totals from Spring Page. Page indexes are zero-based.

### PlaylistResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/PlaylistResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `name` | `String` | None on field |
| `isPublic` | `boolean` | None on field |
| `songCount` | `int` | None on field |
| `songs` | `List<SongResponse>` | None on field |
| `createdAt` | `LocalDateTime` | None on field |

Verify actual `public` versus `isPublic` wire naming before changing consumers; this table preserves the Java declaration.

### RefreshTokenRespose

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/RefreshTokenRespose.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `accessToken` | `String` | None on field |
| `tokenType` | `String` | None on field |
| `expiresIn` | `long` | None on field |

### SearchResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/SearchResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `songs` | `List<SongResponse>` | None on field |
| `artists` | `List<ArtistSummaryResponse>` | None on field |
| `albums` | `List<AlbumSummaryResponse>` | None on field |
| `playlists` | `List<PlaylistResponse>` | None on field |

### SongResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/SongResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `title` | `String` | None on field |
| `duration` | `int` | None on field |
| `coverUrl` | `String` | None on field |
| `fileUrl` | `String` | None on field |
| `artist` | `ArtistSummaryResponse` | None on field |
| `album` | `AlbumSummaryResponse` | None on field |
| `listenerCount` | `long` | None on field |
| `createdAt` | `LocalDateTime` | None on field |

### StatsResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/StatsResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `totalUsers` | `long` | None on field |
| `totalSongs` | `long` | None on field |
| `totalArtists` | `long` | None on field |
| `totalPlaylists` | `long` | None on field |
| `pendingUploads` | `long` | None on field |
| `totalListens` | `long` | None on field |

### UploadResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/UploadResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `status` | `String` | None on field |
| `createdAt` | `LocalDateTime` | None on field |
| `song` | `SongResponse` | None on field |

### UserAdminResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/UserAdminResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `username` | `String` | None on field |
| `email` | `String` | None on field |
| `role` | `Role` | None on field |
| `status` | `UserStatus` | None on field |
| `createdAt` | `LocalDateTime` | None on field |

### UserResponse

[Source](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/dto/response/UserResponse.java)

| Java field | Type | Declared validation |
| --- | --- | --- |
| `id` | `UUID` | None on field |
| `username` | `String` | None on field |
| `email` | `String` | None on field |
| `role` | `Role` | None on field |
| `status` | `UserStatus` | None on field |
