import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { albumsApi, artistsApi } from "@/lib/api";
import { usePagedSearch } from "./usePagedSearch";
import Artwork from "@/components/music/Artwork";
import {
  CollectionFooter,
  EmptyState,
  LoadMore,
} from "@/components/music/Collection";
export default function CatalogGallery({ artists = false }) {
  const catalog = usePagedSearch(
    ({ query, page, size }) =>
      (artists ? artistsApi.getArtists : albumsApi.getAlbums)({
        q: query,
        page,
        size,
      }),
    { initialSize: 12 },
  );
  const label = artists ? "Nghệ sĩ" : "Album";
  return (
    <div className="catalog-page">
      <header className="catalog-title">
        <p className="eyebrow">
          <i />
          THƯ VIỆN ·{" "}
          {artists ? "NHỮNG NGƯỜI KỂ CHUYỆN" : "NHỮNG THẾ GIỚI ÂM NHẠC"}
        </p>
        <h1>
          {label}
          <span className="brand-dot">.</span>
        </h1>
        <p>
          {artists
            ? "Khám phá những cá tính làm nên âm nhạc bạn yêu."
            : "Mỗi album là một hành trình. Bạn muốn bắt đầu từ đâu?"}
        </p>
      </header>
      <div className="gallery-toolbar">
        <label className="collection-search">
          <Search size={16} />
          <input
            aria-label={`Tìm ${label.toLowerCase()}`}
            placeholder={`Tìm ${label.toLowerCase()}…`}
            value={catalog.query}
            onChange={(e) => catalog.setQuery(e.target.value)}
          />
          {catalog.query && (
            <button
              aria-label="Xóa tìm kiếm"
              onClick={() => catalog.setQuery("")}
            >
              <X size={15} />
            </button>
          )}
        </label>
        <span>
          {catalog.totalElements} {label.toLowerCase()}
        </span>
      </div>
      {catalog.error && (
        <p className="inline-error" role="alert">
          {catalog.error}
        </p>
      )}
      {catalog.loading ? (
        <p className="track-loading" role="status">
          Đang khám phá…
        </p>
      ) : (
        <div className={`catalog-grid ${artists ? "artist-grid" : ""}`}>
          {catalog.items.map((item) => (
            <Link
              key={item.id}
              className="album-card"
              to={`/music/${artists ? "artists" : "albums"}/${item.id}`}
            >
              <Artwork
                src={artists ? item.avatarUrl : item.coverUrl}
                title={item.name}
              />
              <h3>{item.name}</h3>
              <p>
                {artists
                  ? `${item.songCount || 0} bài hát`
                  : item.artist?.name || "Album"}
              </p>
            </Link>
          ))}
        </div>
      )}
      {!catalog.loading && !catalog.error && !catalog.items.length && (
        <EmptyState
          title={`Không tìm thấy ${label.toLowerCase()}`}
          description="Thử một từ khóa khác hoặc quay lại sau."
        />
      )}
      <LoadMore
        hasMore={catalog.hasMore}
        loading={catalog.loadingMore}
        onClick={catalog.loadMore}
      />
      <CollectionFooter />
    </div>
  );
}
