# Frontend redesign — 2026-11-17

[Documentation index](README.md)

This update replaces the earlier red/white frontend with the dark olive and lime design derived from **all 24 screenshots** in `template/screenshots/`. It preserves the MusicFlow brand, Vietnamese interface, existing client routes, and backend contracts. Backend code was not changed.

## Visual system

Theme tokens are in `frontend_MussicApp/src/index.css`; application layout and domain styles are in `src/styles/music.css`.

| Token / dimension | Value |
| --- | --- |
| Background | #0e120e |
| Foreground | #edf0e6 |
| Card surface | #161c14 |
| Lime accent | #c3f17c |
| Muted text | #929c87 |
| Divider | #252d21 |
| Desktop sidebar | 218px |
| Compact sidebar | 190px below 1150px |
| Mobile layout | At 700px and below |
| Desktop/tablet player | 104px |
| Mobile player | 134px plus device safe area |

The design uses spacious collection headers, small uppercase labels, restrained artwork cards, compact track rows, fine dividers, lime active states, and a persistent player. Tablet hides supplementary record artwork; mobile replaces the sidebar with quick navigation and an accessible menu. The queue floats above the player and becomes nearly full-width on mobile.

Artwork comes from API URLs. Missing/failed artwork receives a decorative CSS record/initial fallback, rather than a broken image or fabricated album asset. The HVL album and screenshot track names are not inserted into the live catalog. The interface does not make unsupported lossless audio claims.

## Component ownership

| File, relative to frontend src | Responsibility |
| --- | --- |
| components/music/Brand.jsx | Shared MusicFlow waveform/wordmark |
| components/music/Artwork.jsx | API image with a local CSS fallback |
| components/music/Collection.jsx | CollectionHero, CollectionToolbar, TrackList, EmptyState, RecordAside, CollectionFooter, LoadMore |
| components/AppHeader.jsx | Public header, music breadcrumbs/profile/admin link, mobile quick navigation |
| components/SidebarApp.jsx | Complete music navigation and mobile menu |
| pages/music/MusicLayout.jsx | Persistent provider/player and responsive shell |
| contexts/MusicContext.jsx | Catalog seed, active song, collection queue, play state, shuffle/repeat, history selection writes |
| components/MusicPlay.jsx | Audio element, seek/volume, responsive controls, queue panel, playlist dialog |
| components/LikeButton.jsx | Like/unlike API, error state, same-song synchronization event |
| hooks/useLikedSongs.js | Normalize nested favorite results into IDs and receive updates |
| hooks/useDialogFocus.js | Initial visible focus, Tab containment, Escape close, focus restoration |
| lib/queue.js | Pure queue normalization, shuffle and next-index policy |
| lib/format.js | Shared duration display |
| features/catalog/CatalogGallery.jsx | Artist/album discovery cards and pagination |
| features/songs/SongCatalog.jsx | Shared paged songs/trending page |

Landing, login/signup, profile, playlists, upload, and all admin page templates use the same semantic colors. Landing and admin navigation have dedicated layouts. Existing user-created history artist-filter work is retained as an active artist filter over loaded history rows.

## Playback contract

`MusicProvider` remains mounted across music child routes. It exposes:

- `songs`, `songsLoading`, `songsError`, `reloadSongs()` for the initial trending catalog.
- `queue`, `currentSong`, `isPlaying`, `setIsPlaying(valueOrUpdater)`.
- `setCurrentSong(song, collection?)`: select and begin playback; optional collection preserves its order. Existing one-argument callers remain supported.
- `playCollection(songs, shuffle=false)`: start the first track of an ordered or shuffled collection.
- `selectQueueSong(song)`, `nextSong(ended=false)`, `previousSong()`.
- `isShuffling`, `toggleShuffle()`, `repeatMode`, `setRepeatMode()`.

Queue normalization drops missing/duplicate IDs. A separately selected song can be prepended without losing the remaining collection. The original collection is retained when toggling shuffle off. Selecting from a playlist now passes its song list, instead of implicitly replacing it with trending results.

Pause/resume does not reassign `audio.src`. Automatic end-of-queue stops in repeat-none, wraps in repeat-all, and restarts the element in repeat-one. Actual play promise/media failures display a dismissible error. Audio controls remain disabled until a playable URL exists. A failed catalog request no longer inserts a hardcoded sample song.

Server history still records selection and is not a duration-qualified play metric. The local listen tracker remains separate; backend trending and listener-count semantics are unchanged. This redesign does not fix server authorization, moderation visibility, HTTP status mapping, or database migration gaps.

## Favorites and searches

`LikeButton` emits `musicflow:favorite` with `{songId, liked}` after a successful mutation. Other mounted buttons and useLikedSongs consumers update immediately. Favorites reload after the event. The player can query the existing favorite-status endpoint when no initial liked value is supplied. Nested `{song, addedAt}` responses are normalized before deriving IDs.

Collection search uses the API or local filtering appropriate to each page. Global search stores q in the URL, debounces requests, ignores stale results, and exposes category tabs. Song sorting and history artist filtering apply to loaded rows; they do not imply a global database sort/filter contract that the server lacks.

The user upload form continues sending multipart to `/api/songs`, but no longer tries to approve using the returned Song UUID. Actual moderation remains a separate backend concern. Adding a song to a playlist retains `/api/playlists/{id}/songs` with `{songId}`.

## Verification and previews

From `frontend_MussicApp`:

```sh
npm run build
npm run lint
npm test
npm run test:e2e
```

The queue unit suite uses node:test without a browser. Browser tests use Playwright and local fixtures for metadata, media, and artwork; these fixtures are not part of production assets or API fallbacks. The browser fixture suite covers responsive reference states, all 17 registered screen variants used by the smoke test, empty catalog, pause/resume, queue ordering/shuffle restoration, playlist requests, and cross-component favorites.

Browser tests use a local Chrome installation on macOS when available. Set `PLAYWRIGHT_CHROME_PATH` to another executable, or install Playwright Chromium with `npx playwright install chromium` on a machine without a suitable local browser. The config starts/reuses Vite on port 5173 with a relative API base. Screenshots are saved to root `docs/redesign-previews/`; generated browser reports are ignored by the frontend repository.

Previews contain explicit test catalog data and do not demonstrate connectivity to a running Spring Boot API, SMTP, PostgreSQL, Redis, or S3. Real authentication, deployment and file uploads still require those services and credentials.

See [desktop album](redesign-previews/desktop-01-album.png), [tablet album](redesign-previews/tablet-01-album.png), [mobile album](redesign-previews/mobile-01-album.png), and [mobile queue](redesign-previews/mobile-07-queue.png).

## Completed checks

On 2026-11-17, production build and ESLint passed; all 4 queue unit tests and all 11 browser tests passed. The route smoke test was subsequently rerun to capture additional public/account/admin previews and passed. Independent review findings on one-track repeat-all, mobile repeat access, and dashboard collection identity were corrected with regression coverage. No backend source was modified and no deployment was performed.
