import { test, expect } from "@playwright/test";
import { setup } from "./fixtures";
import fs from "node:fs/promises";
const previewDir = "docs/redesign-previews";
async function capture(page, name) {
  await page.locator("img").evaluateAll((images) =>
    Promise.all(
      images
        .filter((img) => {
          const bounds = img.getBoundingClientRect();
          return (
            img.getClientRects().length &&
            bounds.top < innerHeight &&
            bounds.bottom > 0
          );
        })
        .map((img) =>
          Promise.race([
            img.decode().catch(() => {}),
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ]),
        ),
    ),
  );
  await fs.mkdir(previewDir, { recursive: true });
  await page.screenshot({
    path: `${previewDir}/${name}.png`,
    fullPage: name.includes("-02-"),
  });
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
}
for (const [device, width, height] of [
  ["desktop", 1440, 1000],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
]) {
  test(`${device}: collection, liked, search and queue states`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    const { favorites } = await setup(page);
    await page.goto("/music/albums/album-1");
    await expect(
      page.getByRole("heading", { name: "Một khoảng trời riêng." }),
    ).toBeVisible();
    await expect(page.locator(".track-row")).toHaveCount(3);
    await noOverflow(page);
    await capture(page, `${device}-01-album`);
    await capture(page, `${device}-02-album-full`);
    await page.getByRole("button", { name: "Mở hàng đợi" }).click();
    await expect(
      page.getByRole("dialog", { name: "Hàng đợi của bạn" }),
    ).toBeVisible();
    await capture(page, `${device}-07-queue`);
    await page.getByRole("button", { name: "Ngẫu nhiên hàng đợi" }).click();
    await expect(
      page.getByText("ĐANG BẬT CHẾ ĐỘ PHÁT NGẪU NHIÊN"),
    ).toBeVisible();
    await capture(page, `${device}-08-queue-shuffle`);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goto("/music/favorites");
    await expect(page.getByText("Giữ những giai điệu bạn yêu")).toBeVisible();
    await capture(page, `${device}-03-liked-empty`);
    favorites.add("song-1");
    favorites.add("song-2");
    await page.reload();
    await expect(page.locator(".track-row")).toHaveCount(2);
    await capture(page, `${device}-04-liked-songs`);
    await page
      .getByRole("textbox", { name: "Tìm trong bộ sưu tập" })
      .fill("không có bài này");
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy bài hát" }),
    ).toBeVisible();
    await capture(page, `${device}-06-search-empty`);
    await page.goto("/music/search?q=bình");
    await expect(page.locator(".track-row")).toHaveCount(3);
    await capture(page, `${device}-05-search-results`);
    await noOverflow(page);
    if (device === "mobile") {
      await page.getByRole("button", { name: "Mở menu", exact: true }).click();
      await expect(page.locator(".music-sidebar.mobile-open")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator(".music-sidebar.mobile-open")).toHaveCount(0);
    }
  });
}
test("pause and resume preserve position; queue selection and next use collection order", async ({
  page,
}) => {
  const { requests } = await setup(page);
  await page.goto("/music/albums/album-1");
  await page.getByRole("button", { name: "Phát bộ sưu tập" }).click();
  await expect(
    page.getByRole("button", { name: "Tạm dừng", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => page.locator("audio").evaluate((a) => a.currentTime))
    .toBeGreaterThan(0.1);
  await page.locator("audio").evaluate((a) => {
    a.currentTime = 2;
  });
  await page.getByRole("button", { name: "Tạm dừng", exact: true }).click();
  const paused = await page.locator("audio").evaluate((a) => a.currentTime);
  await page.getByRole("button", { name: "Phát nhạc", exact: true }).click();
  await expect
    .poll(() => page.locator("audio").evaluate((a) => a.currentTime))
    .toBeGreaterThanOrEqual(paused);
  await page.getByRole("button", { name: "Bài tiếp theo" }).click();
  await expect(page.locator(".player-song-info strong")).toHaveText(
    "Những ngày bình yên",
  );
  await expect(page.locator("audio")).toHaveAttribute(
    "src",
    "/fixture-audio.wav?track=2",
  );
  await page
    .getByRole("button", { name: "Thêm vào playlist", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Lưu vào playlist" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Thêm bài hát", exact: true }).click();
  await expect(page.getByText("Đã thêm bài hát vào playlist.")).toBeVisible();
  expect(
    requests.some(
      (r) =>
        r.path === "/api/playlists/playlist-1/songs" &&
        JSON.parse(r.body).songId === "song-2",
    ),
  ).toBe(true);
});
test("favorite changes synchronize player and collection", async ({ page }) => {
  await setup(page);
  await page.goto("/music/albums/album-1");
  const row = page.locator(".track-row").first();
  await row
    .getByRole("button", { name: "Yêu thích bài hát", exact: true })
    .click();
  await expect(
    page.locator(".player-song").getByRole("button", { name: "Bỏ yêu thích" }),
  ).toBeVisible();
  await page
    .locator(".player-song")
    .getByRole("button", { name: "Bỏ yêu thích" })
    .click();
  await expect(
    row.getByRole("button", { name: "Yêu thích bài hát", exact: true }),
  ).toBeVisible();
});
test("empty catalog has no sample song and player is disabled", async ({
  page,
}) => {
  await setup(page, { empty: true });
  await page.goto("/music/songs");
  await expect(
    page.getByRole("heading", { name: "Chưa có bài hát" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Phát nhạc", exact: true }),
  ).toBeDisabled();
  await expect(page.getByText("Sample Song")).toHaveCount(0);
});
test("all routed screens render without crashes or mobile overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/login",
    "/signup",
    "/music",
    "/music/trending",
    "/music/songs",
    "/music/artists",
    "/music/artists/artist-1",
    "/music/albums",
    "/music/playlists",
    "/music/history",
    "/music/profile",
    "/music/upload",
    "/admin/accounts",
    "/admin/artists",
    "/admin/albums",
    "/admin/songs",
  ]) {
    await page.goto(route);
    await page.waitForTimeout(200);
    await expect(page.locator("#root")).not.toBeEmpty();
    await noOverflow(page);
    if (["/", "/login", "/signup", "/music/playlists", "/music/profile", "/music/upload", "/admin/accounts"].includes(route)) {
      await fs.mkdir(`${previewDir}/routes`, {recursive:true});
      await capture(page, `routes/mobile-${route === "/" ? "landing" : route.slice(1).replaceAll("/", "-")}`);
    }
  }
  expect(errors).toEqual([]);
});

test("shuffle off restores album queue rather than trending catalog", async ({
  page,
}) => {
  await setup(page, { extraTrending: true });
  await page.goto("/music/albums/album-1");
  await page.getByRole("button", { name: "Phát bộ sưu tập" }).click();
  await page
    .getByRole("region", { name: "Trình phát nhạc" })
    .getByRole("button", { name: "Phát ngẫu nhiên", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Trình phát nhạc" })
    .getByRole("button", { name: "Phát ngẫu nhiên", exact: true })
    .click();
  await page.getByRole("button", { name: "Mở hàng đợi" }).click();
  await expect(page.locator(".queue-item")).toHaveCount(2);
  await expect(page.locator(".queue-item").first()).toContainText(
    "Những ngày bình yên",
  );
});

test("repeat all restarts a single-song queue", async ({ page }) => {
  await setup(page, { singleSong: true });
  await page.goto("/music/albums/album-1");
  await page.getByRole("button", { name: "Phát bộ sưu tập" }).click();
  await page
    .getByRole("button", { name: "Lặp lại: none", exact: true })
    .click();
  await expect
    .poll(() => page.locator("audio").evaluate((audio) => audio.currentTime))
    .toBeGreaterThan(0.2);
  const afterEnd = await page
    .locator("audio")
    .evaluate(
      (audio) =>
        new Promise((resolve) =>
          audio.addEventListener(
            "ended",
            () =>
              setTimeout(
                () =>
                  resolve({ paused: audio.paused, time: audio.currentTime }),
                150,
              ),
            { once: true },
          ),
        ),
    );
  expect(afterEnd.paused).toBe(false);
  expect(afterEnd.time).toBeLessThan(1);
});
test("mobile queue exposes repeat modes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  await page.goto("/music/albums/album-1");
  await page.getByRole("button", { name: "Mở hàng đợi" }).click();
  const queue = page.getByRole("dialog", { name: "Hàng đợi của bạn" });
  await queue
    .getByRole("button", { name: "Chế độ lặp lại: none", exact: true })
    .click();
  await expect(
    queue.getByRole("button", { name: "Chế độ lặp lại: all", exact: true }),
  ).toBeVisible();
});
test("dashboard hero describes the trending collection it plays", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/music");
  await expect(page.locator(".hero-copy h1")).toHaveText("Giai điệu hôm nay.");
  await expect(page.locator(".hero-artist")).toContainText(
    "MusicFlow Selection",
  );
});
