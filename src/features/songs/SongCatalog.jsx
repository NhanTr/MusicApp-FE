import { useMemo, useState } from "react";
import { songsApi } from "@/lib/api";
import { usePagedSearch } from "@/features/catalog/usePagedSearch";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import {
  CollectionFooter,
  CollectionHero,
  CollectionToolbar,
  EmptyState,
  LoadMore,
  RecordAside,
  TrackList,
} from "@/components/music/Collection";
export default function SongCatalog({ trending = false }) {
  const [sort, setSort] = useState("default");
  const likedIds = useLikedSongs();
  const catalog = usePagedSearch(
    async ({ query, page, size }) =>
      query
        ? songsApi.searchSongs(query, { page, size })
        : trending
          ? songsApi.getTrendingSongs({ page, size })
          : songsApi.getSongs({ page, size, sort: "createdAt,desc" }),
    { initialSize: 20 },
  );
  const songs = useMemo(() => {
    const items = [...catalog.items];
    if (sort === "title")
      items.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    if (sort === "listeners")
      items.sort((a, b) => (b.listenerCount || 0) - (a.listenerCount || 0));
    return items;
  }, [catalog.items, sort]);
  const first = songs[0];
  return (
    <div className="collection-page">
      <CollectionHero
        title={trending ? "Đang được lắng nghe" : "Mọi giai điệu"}
        eyebrow={
          trending
            ? "XU HƯỚNG · NHỮNG ÂM THANH ĐƯỢC YÊU"
            : "THƯ VIỆN · KHÁM PHÁ KHÔNG GIỚI HẠN"
        }
        artist={trending ? "Cộng đồng MusicFlow" : "MusicFlow Collection"}
        image={first?.coverUrl}
        count={catalog.totalElements}
        description={
          trending
            ? "Những ca khúc đang kết nối mọi người."
            : "Tìm một giai điệu. Khám phá cả một thế giới."
        }
      />
      <CollectionToolbar
        songs={songs}
        query={catalog.query}
        onQueryChange={catalog.setQuery}
      >
        <select
          value={sort}
          aria-label="Sắp xếp bài hát"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">{trending ? "Xu hướng" : "Mới nhất"}</option>
          <option value="title">Tên A–Z</option>
          <option value="listeners">Lượt nghe</option>
        </select>
      </CollectionToolbar>
      <div className="collection-body">
        <div>
          <TrackList
            songs={songs}
            loading={catalog.loading}
            error={catalog.error}
            likedIds={likedIds}
          />
          {!catalog.loading && !catalog.error && !songs.length && (
            <EmptyState
              type={catalog.query ? "search" : "music"}
              title={
                catalog.query ? "Không tìm thấy bài hát" : "Chưa có bài hát"
              }
              description={
                catalog.query
                  ? undefined
                  : "Tải lên giai điệu đầu tiên hoặc quay lại sau."
              }
            />
          )}
          <LoadMore
            hasMore={catalog.hasMore}
            loading={catalog.loadingMore}
            onClick={catalog.loadMore}
          />
        </div>
        <RecordAside
          image={first?.coverUrl}
          title={first?.title || "Mỗi ngày một giai điệu"}
          artist={first?.artist?.name || "MusicFlow"}
        />
      </div>
      <CollectionFooter />
    </div>
  );
}
