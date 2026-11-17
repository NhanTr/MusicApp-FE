import { useEffect } from "react";
import { favoritesApi } from "@/lib/api";
import { useMusic } from "@/contexts/MusicContext";
import { usePagedSearch } from "@/features/catalog/usePagedSearch";
import { resolveSongEntity, resolveSongId } from "@/lib/song-utils";
import {
  CollectionFooter,
  CollectionHero,
  CollectionToolbar,
  EmptyState,
  LoadMore,
  RecordAside,
  TrackList,
} from "@/components/music/Collection";
export default function Favorites() {
  const { currentSong } = useMusic();
  const catalog = usePagedSearch(
    ({ query, page, size }) =>
      favoritesApi.getFavorites({ q: query, page, size }),
    { initialSize: 20 },
  );
  const songs = catalog.items.map(resolveSongEntity);
  const likedIds = new Set(songs.map(resolveSongId));
  const { reload } = catalog;
  useEffect(() => {
    function changed() {
      reload();
    }
    window.addEventListener("musicflow:favorite", changed);
    return () => window.removeEventListener("musicflow:favorite", changed);
  }, [reload]);
  const image = songs[0]?.coverUrl || currentSong?.coverUrl;
  return (
    <div className="collection-page">
      <CollectionHero
        title="Giai điệu yêu thích"
        eyebrow="BỘ SƯU TẬP CÁ NHÂN"
        image={image}
        count={catalog.totalElements}
        duration={
          catalog.hasMore
            ? undefined
            : songs.reduce((n, s) => n + (s.duration || 0), 0)
        }
        description="Những giai điệu bạn luôn muốn nghe lại."
      />
      <CollectionToolbar
        query={catalog.query}
        onQueryChange={catalog.setQuery}
        songs={songs}
      />
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
              type={catalog.query ? "search" : "likes"}
              title={
                catalog.query
                  ? "Không tìm thấy bài hát"
                  : "Giữ những giai điệu bạn yêu"
              }
              description={
                catalog.query
                  ? "Thử tìm bằng tên bài hát hoặc nghệ sĩ khác."
                  : "Chạm vào trái tim trên bài hát để lưu tại đây."
              }
              action={
                !catalog.query
                  ? { to: "/music/songs", label: "Khám phá âm nhạc" }
                  : null
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
          image={image}
          title="Dành riêng cho bạn"
          artist="Những giai điệu được yêu thương"
        />
      </div>
      <CollectionFooter />
    </div>
  );
}
