# Frontend implementation guide

[Documentation index](README.md)

**Historical baseline:** this guide describes the frontend before the redesign. See [current frontend contracts and component map](14-frontend-redesign.md) for the implemented design, queue state, favorite synchronization, and verification commands.

## Entry points and routes

Sources: [main.jsx](../src/main.jsx), [App.jsx](../src/App.jsx), [AppRoutes.jsx](../src/routes/AppRoutes.jsx).

| URL | Component | Guard / layout |
| --- | --- | --- |
| `/` | LandingPage | Public |
| `/login` | LoginPage | Public |
| `/signup` | SignUpPage | Public |
| `/music` | UserDashboard | ProtectedRoute, MusicLayout |
| `/music/trending` | Trending | Same music layout |
| `/music/songs` | SongsPage | Same music layout |
| `/music/artists` | ArtistsPage | Same music layout |
| `/music/artists/:artistId` | ArtistDetailPage | Same music layout |
| `/music/albums` | AlbumsPage | Same music layout |
| `/music/albums/:albumId` | AlbumDetailPage | Same music layout |
| `/music/search` | SearchPage | Same music layout |
| `/music/playlists` | Playlists | Same music layout |
| `/music/favorites` | Favorites | Same music layout |
| `/music/history` | History | Same music layout |
| `/music/profile` | Profile | Same music layout |
| `/music/upload` | Upload | Same music layout |
| `/admin` | Navigate to accounts | ProtectedRoute + AdminRoute + AdminLayout |
| `/admin/accounts` | AdminAccounts | Same admin guards/layout |
| `/admin/artists` | AdminArtists | Same admin guards/layout |
| `/admin/albums` | AdminAlbums | Same admin guards/layout |
| `/admin/songs` | AdminSongs | Same admin guards/layout |

No wildcard/404 route is registered. `AdminAdmins`, `ArtistsAdmin`, `SongsAdmin`, `UsersAdmin`, `PlaylistsAdmin`, and `UploadsAdmin` exist as source but are not registered in this route tree. A file's existence does not make it reachable through an application route.

## Layout and state ownership

- `AppHeader` loads current user information and sends submitted search text to the search route. It is shared by music pages; landing/header variations are controlled through its props.
- `SidebarApp` supplies user navigation. Music layout hides its sidebar below the medium breakpoint.
- `MusicProvider` owns fetched trending songs, selection, loading/error, and reload. It selects the first fetched song directly on load; that initial state assignment bypasses its history-recording wrapper.
- If the initial song fetch fails, the provider installs a hardcoded external sample track and exposes an error. This can make playback look populated while the API is failing.
- `MusicPlay` owns audio element, queue/index, playing state, time, duration, volume, shuffle, repeat, minimized state, and add-to-playlist dialog.
- User pages keep their own results, query, liked-ID sets, loading, and errors. There is no Redux, React Query, or shared favorites store in the inspected source.

## HTTP helper contract

[lib/api.js](../src/lib/api.js) is the common integration layer.

| Function | Returns / behavior |
| --- | --- |
| `apiFetch(path, options)` | `{response, data}`; data is parsed response body, still enveloped |
| `fetchWithAuth(...)` | Same return shape, adds Bearer access token and refresh behavior |
| `apiJson(...)` | Unwraps `.data` only when payload has both `code` and `data` |
| `fetchWithAuthJson(...)` | Authenticated unwrapped JSON |
| `apiUtils.extractList(value)` | Supports arrays, data.content, content, items, or results |
| `apiUtils.toQueryString(params)` | Omits undefined/null/empty-string values and URL-encodes the rest |

Plain object bodies become JSON and receive JSON headers. FormData keeps browser-generated multipart boundaries; do not manually set its Content-Type. Non-JSON responses become `{message: rawText}`. Failed HTTP status throws an Error with `.status` and `.data`. This layer does not reject merely because the envelope's application `code` is non-200.

API groups are `authApi`, `songsApi`, `playlistsApi`, `albumsApi`, `artistsApi`, `followApi`, `favoritesApi`, `historyApi`, `searchApi`, `adminApi`, and `uploadsApi`. Use [API reference](07-api-reference.md) to check whether each client method has a matching backend route; several do not.

## Pagination and searches

`features/catalog/usePagedSearch.js` debounces queries (250 ms default), trims submitted text, loads page zero after query/size/dependency/reload changes, and appends later pages. A request ID prevents stale results replacing newer results; an unmount flag protects the first-page request. Default initial size is 12, but callers override it. It exposes results, totals, loading flags, errors, `hasMore`, `loadMore`, and `reload`.

`SongsPage` uses initial size 5, calls the dedicated song-search endpoint when text is non-empty, and sorts only loaded items by listener count or title. This is not global database ordering by those UI options. Trending and other pages have their own behavior; inspect the fetch callback and sort logic before modifying shared pagination.

`useCatalogData` separately fetches capped pages of artists (200), albums (400), and songs (800), then builds in-memory maps. It does not retrieve every page. Admin song/album selectors similarly fetch bounded artist/album lists.

## Shared song shapes and favorites

`lib/song-utils.js` resolves nested `song`, `music`, or `track`, accepts `id`/`_id`, and supplies title/artist fallbacks. Backend favorites are `{song, addedAt}`, not direct SongResponse objects. History is `{id, song, listenedAt}`. Normalize these before constructing song-ID sets. Some existing pages do not do so; this is a documented discrepancy, not an alternate backend contract.

`LikeButton` stops click propagation, calls like/unlike, prevents concurrent requests, updates its state, and notifies its parent. It does not broadcast changes to other pages. The server has a status endpoint but the current favorites client group does not expose a status helper.

## Player implementation cautions

The effect assigning `audio.src` depends on both current song and `isPlaying`; toggling playback can reassign the source and reset playback position. The effect receiving active song rebuilds the queue and resets the index. Next/previous also invoke the parent selection callback, causing history writes and another queue rebuild. Shuffle changes local queue state without necessarily changing the active song from context.

`handleEnded` loops repeat-one, otherwise calls next. `nextSong` wraps unconditionally, so repeat `none` and `all` do not currently have distinct end-of-queue stop behavior. Lyrics state exists without a complete routed lyrics feature or backend lyrics field. If changing playback, regression-test actual audio state, not just button icons.

## Styling and build

The `@` alias resolves to `src` in Vite. Components combine Tailwind utilities with CSS entry files; inspect `main.jsx` imports and CSS directives before changing global styles. Shared `components/ui/*.tsx` contains reusable primitives; domain logic belongs in features/components rather than those primitives. The project mixes JS/JSX and TS/TSX; `npm run build` is `vite build`, not a separate `tsc` type check.

Available commands: `npm run dev`, `npm run build`, `npm run lint`, and `npm run preview`. No frontend test script is declared. Frontend `.env` variables are baked into the build; changing a running Nginx container's environment does not rewrite bundled URLs.
