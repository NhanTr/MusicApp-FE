# Redesign previews

These 24 screenshots use explicit local test fixtures, not live user/catalog data. They demonstrate the implemented design at desktop 1440×1000, tablet 768×1024 and mobile 390×844. The original references remain in `template/screenshots/`.

| State | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Album | [View](desktop-01-album.png) | [View](tablet-01-album.png) | [View](mobile-01-album.png) |
| Full album page | [View](desktop-02-album-full.png) | [View](tablet-02-album-full.png) | [View](mobile-02-album-full.png) |
| Empty favorites | [View](desktop-03-liked-empty.png) | [View](tablet-03-liked-empty.png) | [View](mobile-03-liked-empty.png) |
| Favorites | [View](desktop-04-liked-songs.png) | [View](tablet-04-liked-songs.png) | [View](mobile-04-liked-songs.png) |
| Search results | [View](desktop-05-search-results.png) | [View](tablet-05-search-results.png) | [View](mobile-05-search-results.png) |
| Empty search | [View](desktop-06-search-empty.png) | [View](tablet-06-search-empty.png) | [View](mobile-06-search-empty.png) |
| Queue | [View](desktop-07-queue.png) | [View](tablet-07-queue.png) | [View](mobile-07-queue.png) |
| Shuffle queue | [View](desktop-08-queue-shuffle.png) | [View](tablet-08-queue-shuffle.png) | [View](mobile-08-queue-shuffle.png) |

Regenerate from the frontend directory with `npm run test:e2e`. The full-page capture scrolls the document naturally; fixed player placement follows browser screenshot behavior.

Additional mobile route previews: [landing](routes/mobile-landing.png), [login](routes/mobile-login.png), [signup](routes/mobile-signup.png), [playlists](routes/mobile-music-playlists.png), [profile](routes/mobile-music-profile.png), [upload](routes/mobile-music-upload.png), and [admin accounts](routes/mobile-admin-accounts.png).
