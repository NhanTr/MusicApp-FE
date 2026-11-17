import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchApi } from "@/lib/api";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import {
  CollectionFooter,
  EmptyState,
  TrackList,
} from "@/components/music/Collection";
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [state, setState] = useState({ query: "", data: null, error: "" }),
    [category, setCategory] = useState("all");
  const likedIds = useLikedSongs();
  useEffect(() => {
    if (!query.trim()) return;
    let active = true;
    const timer = setTimeout(() => {
      searchApi
        .search(query.trim(), { size: 20 })
        .then((data) => {
          if (active) setState({ query, data, error: "" });
        })
        .catch((error) => {
          if (active) setState({ query, data: null, error: error.message });
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);
  const loading = !!query.trim() && state.query !== query;
  const data = query.trim() && state.query === query ? state.data : null;
  const hasResults =
    data &&
    ["songs", "artists", "albums", "playlists"].some(
      (key) => data[key]?.length,
    );
  return (
    <div className="catalog-page">
      <section className="catalog-title">
        <p className="eyebrow">
          <i />
          TÌM KIẾM · THEO CẢM HỨNG CỦA BẠN
        </p>
        <h1>
          Tìm một giai điệu<span className="brand-dot">.</span>
        </h1>
        <p>Bài hát, nghệ sĩ, album — thế giới âm nhạc đang chờ bạn.</p>
        <label className="collection-search search-main">
          <Search size={20} />
          <input
            autoComplete="off"
            aria-label="Tìm bài hát, nghệ sĩ, album"
            placeholder="Bạn muốn nghe gì hôm nay?"
            value={query}
            onChange={(e) =>
              setParams(e.target.value ? { q: e.target.value } : {}, {
                replace: true,
              })
            }
          />
          {query && (
            <button aria-label="Xóa tìm kiếm" onClick={() => setParams({})}>
              <X size={17} />
            </button>
          )}
        </label>
      </section>
      <nav className="search-categories" aria-label="Loại kết quả">
        {[
          ["all", "Tất cả"],
          ["songs", "Bài hát"],
          ["artists", "Nghệ sĩ"],
          ["albums", "Album"],
          ["playlists", "Playlist"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`search-chip ${category === key ? "active" : ""}`}
            onClick={() => setCategory(key)}
            aria-pressed={category === key}
          >
            {label}
          </button>
        ))}
      </nav>
      {loading && (
        <p className="track-loading" role="status">
          Đang tìm giai điệu của bạn…
        </p>
      )}
      {state.query === query && state.error && (
        <p className="inline-error" role="alert">
          {state.error}
        </p>
      )}
      {!query.trim() && (
        <EmptyState
          type="music"
          title="Âm nhạc bắt đầu từ sự tò mò"
          description="Nhập tên bài hát, nghệ sĩ hoặc album yêu thích."
        />
      )}
      {query.trim() && !loading && !state.error && !hasResults && (
        <EmptyState />
      )}
      {data &&
        (category === "all" || category === "songs") &&
        !!data.songs?.length && (
          <section className="search-section">
            <h2>Bài hát</h2>
            <TrackList songs={data.songs} likedIds={likedIds} />
          </section>
        )}
      {data &&
        [
          ["artists", "Nghệ sĩ", "/music/artists"],
          ["albums", "Album", "/music/albums"],
          ["playlists", "Playlist", "/music/playlists"],
        ]
          .filter(([key]) => category === "all" || category === key)
          .map(([key, label, path]) =>
            data[key]?.length ? (
              <section className="search-section" key={key}>
                <h2>{label}</h2>
                <div className="result-grid">
                  {data[key].map((item) => (
                    <Link
                      className="result-card"
                      key={item.id}
                      to={key === "playlists" ? path : `${path}/${item.id}`}
                    >
                      <h3>{item.name}</h3>
                      <p>{label} ↗</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null,
          )}
      {hasResults && category !== "all" && !data[category]?.length && (
        <EmptyState
          title="Không có kết quả trong mục này"
          description="Thử chọn một loại kết quả khác."
        />
      )}
      <CollectionFooter />
    </div>
  );
}
