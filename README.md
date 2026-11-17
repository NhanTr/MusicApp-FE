# MusicFlow frontend

React/Vite music application with a responsive dark olive and lime interface, adapted from all 24 desktop/tablet/mobile references in the workspace `template/screenshots/` folder.

## Local development

```sh
npm ci
npm run dev
```

Use a Node version compatible with the installed Vite release (the Docker build uses Node 22). Set `VITE_BACKEND_URL` in `.env.local` to your API origin, or leave it empty to use relative `/api` requests through the Vite proxy. Its default destination is `http://localhost:8080`. The browser app requires a running backend for real accounts/catalog/uploads; test fixtures are never used as application fallback data.

## Verification

```sh
npm run build
npm run lint
npm test
npm run test:e2e
```

Unit tests cover queue normalization, shuffle and repeat policy. Playwright tests use local API/media fixtures and verify responsive reference states, screen rendering, favorites, playlist requests, pause/resume, repeat and shuffle restoration. The test config uses local macOS Chrome if available, a `PLAYWRIGHT_CHROME_PATH` override when supplied, or Playwright's default Chromium. Install the latter with `npx playwright install chromium` if needed. Browser previews are written to `docs/redesign-previews/`.

## Implementation map

- `src/styles/music.css` and `src/index.css`: application design system and semantic colors.
- `src/components/music/`: artwork, brand and reusable collection components.
- `src/contexts/MusicContext.jsx`: active song, collection queue and playback state.
- `src/components/MusicPlay.jsx`: audio, player controls, queue and playlist dialogs.
- `src/routes/AppRoutes.jsx`: public, listener and admin routes.
- `src/lib/api.js`: existing API helpers and token refresh.
- `tests/browser/`: test-only API/media fixtures and browser checks.

See the workspace [documentation index](docs/README.md) and [current frontend redesign guide](docs/14-frontend-redesign.md) for detailed contracts and known backend limitations. Project documentation and reference screenshots are included in this repository; backend links point to its companion repository.
