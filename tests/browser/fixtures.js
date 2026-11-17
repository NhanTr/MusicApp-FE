import { Buffer } from "node:buffer";
export const songs = [
  {
    id: "song-1",
    title: "Để âm nhạc dẫn lối",
    duration: 180,
    artist: { id: "artist-1", name: "MusicFlow Sessions" },
    album: { id: "album-1", name: "Một khoảng trời riêng" },
    coverUrl: "/fixture-cover.svg",
    fileUrl: "/fixture-audio.wav",
    listenerCount: 120,
  },
  {
    id: "song-2",
    title: "Những ngày bình yên",
    duration: 216,
    artist: { id: "artist-1", name: "MusicFlow Sessions" },
    album: { id: "album-1", name: "Một khoảng trời riêng" },
    coverUrl: "/fixture-cover.svg",
    fileUrl: "/fixture-audio.wav?track=2",
    listenerCount: 95,
  },
  {
    id: "song-3",
    title: "Một câu chuyện thật dài với những giai điệu không bao giờ kết thúc",
    duration: 172,
    artist: { id: "artist-1", name: "MusicFlow Sessions" },
    album: { id: "album-1", name: "Một khoảng trời riêng" },
    coverUrl: "/missing-cover.jpg",
    fileUrl: "/fixture-audio.wav?track=3",
    listenerCount: 72,
  },
];
export const album = {
  id: "album-1",
  name: "Một khoảng trời riêng",
  artist: { id: "artist-1", name: "MusicFlow Sessions" },
  coverUrl: "/fixture-cover.svg",
  releaseDate: "2026-01-01",
  songs,
  totalSongs: 3,
  totalDuration: 568,
};
export async function setup(
  page,
  {
    empty = false,
    auth = true,
    extraTrending = false,
    singleSong = false,
  } = {},
) {
  if (auth)
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "test-access");
      localStorage.setItem("refreshToken", "test-refresh");
    });
  const favorites = new Set();
  const requests = [];
  const cover =
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><defs><radialGradient id="g"><stop stop-color="#5e7843"/><stop offset="1" stop-color="#10190d"/></radialGradient></defs><rect width="600" height="600" fill="url(#g)"/><g fill="none" stroke="#c3f17c" opacity=".3"><circle cx="300" cy="280" r="210"/><circle cx="300" cy="280" r="190"/><circle cx="300" cy="280" r="170"/><circle cx="300" cy="280" r="150"/></g><text x="300" y="310" text-anchor="middle" fill="#e6f0d5" font-family="Arial" font-size="110" font-weight="700">mf.</text><text x="300" y="540" text-anchor="middle" fill="#c3f17c" font-family="Arial" font-size="16" letter-spacing="6">MUSICFLOW SESSIONS</text></svg>';
  await page.route("**/fixture-cover.svg", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: cover }),
  );
  await page.route("**/missing-cover.jpg", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  // Silent local audio only; fixtures are never included in production assets.
  const wav = Buffer.alloc(44 + 44100 * 2 * 8);
  wav.write("RIFF");
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(44100, 24);
  wav.writeUInt32LE(88200, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(wav.length - 44, 40);
  await page.route("**/fixture-audio.wav*", (route) =>
    route.fulfill({ contentType: "audio/wav", body: wav }),
  );
  await page.route("**/api/**", async (route) => {
    const req = route.request(),
      url = new URL(req.url()),
      path = url.pathname,
      method = req.method();
    requests.push({ path, method, body: req.postData() });
    const list = empty ? [] : singleSong ? songs.slice(0, 1) : songs;
    if (extraTrending && path === "/api/songs/trending") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          code: 200,
          data: {
            content: [
              ...songs,
              { ...songs[0], id: "song-extra", title: "Outside collection" },
            ],
            totalPages: 1,
            totalElements: 4,
          },
        }),
      });
      return;
    }
    const paged = (items) => ({
      content: items,
      totalElements: items.length,
      totalPages: items.length ? 1 : 0,
      page: 0,
      size: 20,
    });
    let data = null;
    if (path === "/api/auth/me")
      data = {
        id: "user-1",
        username: "Listener",
        email: "listener@example.test",
        role: "ADMIN",
        status: "ACTIVE",
      };
    else if (
      path === "/api/auth/login" ||
      path === "/api/auth/login/verify-otp"
    )
      data = { accessToken: "test-access", refreshToken: "test-refresh" };
    else if (path.includes("/status") && path.includes("/favorites/"))
      data = { liked: favorites.has(path.split("/")[3]) };
    else if (path.startsWith("/api/favorites/") && method === "POST") {
      favorites.add(path.split("/")[3]);
      data = "Added";
    } else if (path.startsWith("/api/favorites/") && method === "DELETE") {
      favorites.delete(path.split("/")[3]);
      data = "Removed";
    } else if (path === "/api/favorites")
      data = paged(
        list
          .filter(
            (s) =>
              favorites.has(s.id) &&
              (!url.searchParams.get("q") ||
                s.title
                  .toLowerCase()
                  .includes(url.searchParams.get("q").toLowerCase())),
          )
          .map((song) => ({ song, addedAt: "2026-01-01T00:00:00" })),
      );
    else if (path === "/api/albums/album-1")
      data = { ...album, songs: list, totalSongs: list.length };
    else if (path === "/api/albums")
      data = paged(
        empty
          ? []
          : [
              album,
              {
                ...album,
                id: "album-2",
                name: "Chạm vào bình yên",
                coverUrl: null,
              },
            ],
      );
    else if (path === "/api/artists/artist-1")
      data = {
        id: "artist-1",
        name: "MusicFlow Sessions",
        avatarUrl: "/fixture-cover.svg",
        bio: "Những câu chuyện được kể bằng âm nhạc.",
        songCount: 3,
        isFollowing: false,
      };
    else if (path === "/api/artists")
      data = paged([
        {
          id: "artist-1",
          name: "MusicFlow Sessions",
          avatarUrl: "/fixture-cover.svg",
          songCount: 3,
        },
      ]);
    else if (path === "/api/search") {
      const found = /bình|nhạc|yên/i.test(url.searchParams.get("q") || "");
      data = {
        songs: found ? list : [],
        artists: [],
        albums: [],
        playlists: [],
      };
    } else if (
      path.startsWith("/api/songs") ||
      (path.endsWith("/songs") && method === "GET")
    )
      data = paged(list);
    else if (path === "/api/playlists" && method === "POST")
      data = {
        id: "playlist-2",
        name: "New playlist",
        songs: [],
        public: false,
      };
    else if (path === "/api/playlists" || path === "/api/playlists/public")
      data = paged([
        {
          id: "playlist-1",
          name: "Buổi sáng của tôi",
          public: true,
          songs: list,
          songCount: list.length,
        },
      ]);
    else if (path === "/api/playlists/playlist-1")
      data = {
        id: "playlist-1",
        name: "Buổi sáng của tôi",
        songs: list,
        public: true,
      };
    else if (path === "/api/admin/users")
      data = paged([
        {
          id: "user-1",
          username: "Listener",
          email: "listener@example.test",
          role: "ADMIN",
          status: "ACTIVE",
        },
      ]);
    else if (path === "/api/history" && method === "GET")
      data = paged(
        list.map((song, i) => ({
          id: `history-${i}`,
          song,
          listenedAt: "2026-11-17T09:00:00",
        })),
      );
    else data = "Success";
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ code: 200, message: "Success", data }),
    });
  });
  return { favorites, requests };
}
