import { useEffect, useMemo, useState } from "react";
import { Trash, Trash2 } from "lucide-react";
import { historyApi, apiUtils, artistsApi } from "@/lib/api";
import { usePagedSearch } from "@/features/catalog/usePagedSearch";
import { resolveSongEntity } from "@/lib/song-utils";
import {
  CollectionFooter,
  CollectionHero,
  CollectionToolbar,
  EmptyState,
  LoadMore,
  TrackList,
} from "@/components/music/Collection";

// Retains the artist-filter helper from the existing local work.
const ARTIST_OPTIONS = async () => {
  try {
    const artists = await artistsApi.getArtists({ size: 1000 });
    return apiUtils
      .extractList(artists)
      .map((artist) => ({
        value: artist.id || artist._id,
        label: artist.name || "Nghệ sĩ",
      }));
  } catch {
    return [];
  }
};
export default function History() {
  const [artistOptions, setArtistOptions] = useState([]),
    [artistId, setArtistId] = useState(""),
    [sort, setSort] = useState("recent"),
    [actionError, setActionError] = useState("");
  const catalog = usePagedSearch(
    ({ query, page, size }) => historyApi.getHistory({ q: query, page, size }),
    { initialSize: 20 },
  );
  useEffect(() => {
    let active = true;
    ARTIST_OPTIONS().then((items) => {
      if (active) setArtistOptions(items);
    });
    return () => {
      active = false;
    };
  }, []);
  const events = useMemo(() => {
    const items = catalog.items.filter(
      (item) => !artistId || resolveSongEntity(item)?.artist?.id === artistId,
    );
    if (sort === "oldest")
      items.sort((a, b) => new Date(a.listenedAt) - new Date(b.listenedAt));
    return items;
  }, [catalog.items, artistId, sort]);
  const songs = events.map(resolveSongEntity);
  async function remove(id) {
    try {
      await historyApi.deleteHistoryById(id);
      catalog.reload();
    } catch (error) {
      setActionError(error.message);
    }
  }
  async function clear() {
    if (!window.confirm("Xóa toàn bộ lịch sử nghe của bạn?")) return;
    try {
      await historyApi.deleteAllHistory();
      catalog.reload();
    } catch (error) {
      setActionError(error.message);
    }
  }
  return (
    <div className="collection-page">
      <CollectionHero
        title="Đã từng lắng nghe"
        eyebrow="LỊCH SỬ · NHỮNG GIAI ĐIỆU ĐI QUA"
        count={catalog.totalElements}
        image={songs[0]?.coverUrl}
        description="Mỗi lần nghe là một khoảnh khắc. Tìm lại những giai điệu của bạn."
      />
      <CollectionToolbar
        query={catalog.query}
        onQueryChange={catalog.setQuery}
        songs={songs}
      >
        <select
          aria-label="Sắp xếp lịch sử"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recent">Mới nghe nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
        <select
          aria-label="Lọc nghệ sĩ đã tải"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
        >
          <option value="">Mọi nghệ sĩ</option>
          {artistOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </CollectionToolbar>
      {actionError && (
        <p className="inline-error" role="alert">
          {actionError}
        </p>
      )}
      <TrackList
        songs={songs}
        loading={catalog.loading}
        error={catalog.error}
        trailing={(_, i) => (
          <button
            className="icon-button"
            onClick={() => remove(events[i].id)}
            aria-label={`Xóa ${songs[i]?.title} khỏi lịch sử`}
          >
            <Trash2 size={15} />
          </button>
        )}
      />
      {!catalog.loading && !catalog.error && !songs.length && (
        <EmptyState
          type="music"
          title="Chưa có giai điệu nào ở đây"
          description="Bắt đầu nghe nhạc để viết nên câu chuyện của bạn."
          action={{ to: "/music/songs", label: "Khám phá âm nhạc" }}
        />
      )}
      <LoadMore
        hasMore={catalog.hasMore}
        loading={catalog.loadingMore}
        onClick={catalog.loadMore}
      />
      {catalog.totalElements > 0 && (
        <button className="secondary-button mt-8" onClick={clear}>
          <Trash size={14} />
          Xóa lịch sử nghe
        </button>
      )}
      <CollectionFooter />
    </div>
  );
}
