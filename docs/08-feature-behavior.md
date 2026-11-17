# Feature behavior and business rules

[Documentation index](README.md)

Each workflow below describes source behavior and points to implementation owners. Read [known gaps](09-security-and-known-gaps.md) alongside these flows before extending them.

## Registration and login

**Registration:** SignUpPage requests an email OTP, then sends username, email, password, and OTP to register. Backend checks username/email uniqueness, validates OTP from Redis, normalizes the stored email, hashes the password, assigns USER/ACTIVE, and saves the account. Successful registration returns user details, not login tokens. DTO limits are username 3–50, password 6–100, valid email, OTP length exactly six. The annotation enforces length, not numeric-only characters.

Registration/login OTPs use separate keys, each valid for five minutes; resend cooldown is one minute. There is no implemented maximum verification-attempt counter in AuthServiceImpl. A failed SMTP send can occur after the OTP/cooldown keys have already been written. Email normalization is not applied consistently before every uniqueness/login lookup, so test case and whitespace explicitly if changing identity rules.

**Password login:** UI sends its email input as `username`; backend searches username then email, verifies BCrypt, rejects BANNED, and issues access/refresh JWTs. The page stores both tokens and requests `/me`, directing admins to `/admin` and other users to `/music`. If the profile check fails, it falls back to `/music`.

**OTP login:** Request an OTP for an existing normalized email, verify it, delete the OTP, and issue tokens. The service lacks the password login's explicit BANNED check. The JWT filter still rejects authentication for a banned user on subsequent requests. This is not a distinct second-factor step after password login; it is an alternative login method.

**Logout:** Profile/AdminLayout call authApi.logout and clear local tokens even on request failure. The helper sends the access token, and backend blacklists exactly that supplied token. A separately copied refresh token is not revoked by this operation.

## Dashboard and discovery

UserDashboard independently loads current user, trending songs, playlists, favorites, and history. Displayed aggregates and recent lists may be derived from bounded response pages rather than authoritative system totals. The provider separately loads trending for the player. A future dashboard statistics feature should define explicit backend aggregates rather than infer totals from arbitrary list lengths.

SongsPage supports paged search and loaded-item sort. ArtistsPage and AlbumsPage use usePagedSearch. ArtistDetailPage loads artist, albums and songs and follow state. AlbumDetailPage loads an album and related albums. Global SearchPage reads search query from navigation and requests multi-category results; those results have no total counts. Some pages also request up to 1000 favorites to initialize like state, which is a bounded list rather than a universal status cache.

## Playback and queue

Selecting a song updates context and posts history asynchronously. The player stays visible throughout music-route navigation, but not when switching to the admin layout. It plays directly from the song URL, offers seek/volume/previous/next/shuffle/repeat controls, can minimize, and can add the selected song to a playlist.

The queue is reconstructed from the selected song plus provider trending results. Selecting a track from an album or playlist does not establish that entire album/playlist as the player queue. Repeat-one restarts the element. Ended playback otherwise advances and wraps, including in repeat-none mode. Playback position/queue/volume are not persisted as an application session across layout unmount/reload.

Server history, server listenerCount, server trending rank, and browser local listen-count are distinct. If implementing an actual play-count feature, first define whether a play means selection, elapsed uninterrupted time, percentage listened, unique listener, or completion, plus repeat suppression and history deletion policy.

## Favorites

LikeButton calls POST/DELETE by song ID. Backend checks duplicate membership before creating a Favorite. Favorites belong to the current user and can be searched by title/artist/album through native unaccent queries. Responses wrap each SongResponse in `{song, addedAt}`. The entity has no addedAt column; the reported timestamp is the read time. Removing a favorite does not delete a song or history.

UI likes are local page state. Several pages incorrectly assume direct song objects when building liked-ID sets. A centralized normalized favorites store would require updating those consumers, not just LikeButton.

## Artist following

Following uses a separate user/artist composite-key table. Duplicate follow requests are a no-op; unfollow removes that relationship. Artist responses derive followerCount and optionally isFollowing based on current-user lookup. Public anonymous reads can return null follow state. Following does not create a playlist or automatically enqueue songs.

## Playlists

The page lists personal and public playlists with searches, supports creation and deletion, expands a selected playlist's songs, and selects individual songs for playback. Backend additionally exposes playlist update and remove-song membership operations. The player fetches up to 100 personal playlists for its add dialog and sends `{songId}` after selection.

Only the owner may update, delete, or change membership. Duplicate song addition succeeds without another row. Private detail is owner-only; public detail is available to authenticated callers because the URL security chain does not permit anonymous detail GET. Public listing is anonymous at the API but the browser page is inside ProtectedRoute.

There is no playlist order, description persistence, collaborators, or standalone detail URL in the route tree. Deleting a non-empty playlist may hit foreign keys because no explicit membership cleanup or cascade is declared. Define cleanup before promising full deletion behavior. Visibility field wire naming needs serialization verification as described in the API reference.

## History

Selecting through the context wrapper adds a new history row with server time, even if the song never begins playback. Initial provider selection bypasses this wrapper. History lists latest first; search filters within the user's rows. A user can remove a single owned event or clear all their events. Repeated selections remain repeated events; the server has no suppression window.

Deleting history removes the source data for trending counts and distinct listener counts. It is not simply hiding rows from the profile. If future analytics must survive privacy/history deletion, a separate aggregate/event model and clear product policy are necessary.

## Upload and moderation

User upload requires a title and chosen audio in the browser, accepts optional cover and manually entered duration, and sends no artist/album selection. AdminSongs includes artist/album selectors and uploads through the same multipart API. The service creates public S3 objects, a Song, and a PENDING Upload. Only multipart creation creates this moderation record; JSON song creation bypasses it.

The user upload form then attempts approval using the returned `id`. The response is SongResponse, so that ID normally does not identify the Upload record. Approval failure is swallowed after upload success. Actual moderation endpoints work on Upload UUID and merely change its status. PENDING/REJECTED does not remove the Song from public catalog queries. Rejection reasons are logged, not saved or returned.

UploadsAdmin exists but has no active client route. Adding a review screen requires routing/navigation and a backend permission/visibility design, not just enabling that page.

## Profile and account changes

Profile loads `/me`, changes password using new and confirmation fields, and logs out. It does not require the current password. Backend also supports changing username and optional password through `/api/users/me`; client authApi.updateProfile instead targets the absent `/api/auth/me` PUT route. Renaming username invalidates lookup by existing JWT subject until tokens are reissued because JWT identity is username-based.

## Administration

Registered admin pages manage artists, albums, songs, and accounts. The admin route guard fetches `/me` and checks for an admin-like role value. This guards navigation; the backend is responsible for API authorization. Account ban/unban updates status immediately; the JWT filter loads database status on each authenticated request, rejecting old tokens while banned. Ban reason is not persisted. Account list and admin song search controls send parameters that their list controllers ignore.

An unrouted AdminAdmins page calls APIs that do not exist. The stats endpoint is implemented but does not imply every admin statistics view is routed. CREATOR is a stored role without a dedicated workflow.
