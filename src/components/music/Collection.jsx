import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  Disc3,
  Heart,
  Play,
  Search,
  Shuffle,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Artwork from "./Artwork";
import { formatTime } from "@/lib/format";
import LikeButton from "@/components/LikeButton";
import { useMusic } from "@/contexts/MusicContext";
import {
  resolveSongArtistName,
  resolveSongId,
  resolveSongTitle,
} from "@/lib/song-utils";
export function CollectionHero({
  eyebrow = "Bộ sưu tập âm nhạc",
  title,
  description,
  image,
  artist = "Dành riêng cho bạn",
  count,
  duration,
  children,
}) {
  return (
    <section className="collection-hero">
      <div className="hero-art">
        <Artwork src={image} title={title} />
        <span>
          <i /> THE COLLECTION
        </span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <i />
          {eyebrow}
        </p>
        <h1>
          {title}
          <span className="brand-dot">.</span>
        </h1>
        <div className="hero-artist">
          <span className="artist-avatar">{artist.slice(0, 1)}</span>
          <strong>{artist}</strong>
          <AudioLines size={15} className="text-primary" />
        </div>
        {description && <p className="hero-description">{description}</p>}
        <div className="hero-meta">
          {count != null && <span>{count} bài hát</span>}
          {duration > 0 && <span>{Math.round(duration / 60)} phút</span>}
          <span>MUSICFLOW</span>
        </div>
        {children}
      </div>
      <span className="hero-note">
        BẬT NHẠC LÊN.
        <br />
        ĐỂ MỌI THỨ LẮNG LẠI.
      </span>
    </section>
  );
}
export function CollectionToolbar({
  query,
  onQueryChange,
  songs = [],
  placeholder = "Tìm trong bộ sưu tập",
  children,
}) {
  const { playCollection } = useMusic();
  return (
    <div className="collection-toolbar">
      <div className="collection-actions">
        <button
          className="primary-button"
          disabled={!songs.length}
          onClick={() => playCollection(songs)}
        >
          <Play size={17} fill="currentColor" />
          Phát bộ sưu tập
        </button>
        <button
          className="icon-button"
          disabled={!songs.length}
          onClick={() => playCollection(songs, true)}
          aria-label="Phát ngẫu nhiên"
        >
          <Shuffle size={20} />
        </button>
      </div>
      <div className="toolbar-filters">
        {children}
        {onQueryChange && (
          <label className="collection-search">
            <Search size={16} />
            <input
              aria-label={placeholder}
              placeholder={placeholder}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
            {query && (
              <button
                aria-label="Xóa tìm kiếm"
                onClick={() => onQueryChange("")}
              >
                <X size={15} />
              </button>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
export function EmptyState({ type = "search", title, description, action }) {
  const Icon = type === "likes" ? Heart : type === "music" ? Disc3 : Search;
  return (
    <div className="empty-state">
      <Icon size={32} strokeWidth={1.5} />
      <h2>{title || "Không tìm thấy bài hát"}</h2>
      <p>{description || "Thử tìm bằng tên bài hát hoặc nghệ sĩ khác."}</p>
      {action && (
        <Link to={action.to}>
          {action.label}
          <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function TrackList({
  songs = [],
  loading,
  error,
  likedIds = new Set(),
  onLikeChange,
  trailing,
  showAlbum = true,
}) {
  const { currentSong, setCurrentSong, isPlaying } = useMusic();
  return (
    <div className="track-list">
      <div className={`track-heading ${!showAlbum ? "no-album" : ""}`}>
        <span>#</span>
        <span>
          BÀI HÁT <ArrowDown size={11} />
        </span>
        {showAlbum && <span className="track-album">ALBUM</span>}
        <span />
        <span className="track-time">THỜI GIAN</span>
      </div>
      {loading ? (
        <div className="track-loading" role="status">
          <AudioLines className="loading-pulse" />
          Đang tải âm nhạc…
        </div>
      ) : error ? (
        <p className="inline-error" role="alert">
          {error}
        </p>
      ) : (
        songs.map((song, i) => {
          const id = resolveSongId(song);
          const selected = resolveSongId(currentSong) === id;
          return (
            <div
              className={`track-row ${selected ? "selected" : ""} ${!showAlbum ? "no-album" : ""}`}
              key={`${id}-${i}`}
            >
              <span className="track-number">
                {selected && isPlaying ? (
                  <AudioLines size={15} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <button
                className="track-title"
                onClick={() => setCurrentSong(song, songs)}
                aria-label={`Phát ${resolveSongTitle(song)}`}
              >
                <strong>{resolveSongTitle(song)}</strong>
                <span>{resolveSongArtistName(song)}</span>
              </button>
              {showAlbum && (
                <span className="track-album">
                  {song.album?.name || "Đĩa đơn"}
                </span>
              )}
              {trailing ? (
                trailing(song, i)
              ) : (
                <LikeButton
                  songId={id}
                  initialLiked={likedIds.has(id)}
                  onLikeChange={(liked) => onLikeChange?.(id, liked)}
                />
              )}
              <span className="track-time">{formatTime(song.duration)}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
export function RecordAside({
  image,
  title = "Âm nhạc của bạn",
  artist = "MusicFlow",
}) {
  return (
    <aside className="record-aside">
      <div className="eyebrow">
        ĐANG TRONG BỘ SƯU TẬP
        <AudioLines size={15} />
      </div>
      <Artwork src={image} title={title} />
      <h2>{title}</h2>
      <p>{artist}</p>
      <div className="record-divider" />
      <p className="eyebrow">MỖI GIAI ĐIỆU. MỘT THẾ GIỚI.</p>
      <p className="record-note">
        Dành một chút thời gian.
        <br />
        Để âm nhạc dẫn lối.
      </p>
      <span className="record-footer">Nghe theo cách của bạn.</span>
    </aside>
  );
}
export function CollectionFooter() {
  return (
    <footer className="collection-footer">
      <Disc3 size={21} />
      <span>
        MusicFlow
        <br />
        <small>Ít ồn ào hơn. Nhiều âm nhạc hơn.</small>
      </span>
      <small>MADE FOR LISTENING ↗</small>
    </footer>
  );
}
export function LoadMore({ hasMore, loading, onClick }) {
  return hasMore ? (
    <div className="load-more">
      <button className="secondary-button" onClick={onClick} disabled={loading}>
        {loading ? "Đang tải…" : "Khám phá thêm"}
        <ArrowDown size={14} />
      </button>
    </div>
  ) : null;
}
