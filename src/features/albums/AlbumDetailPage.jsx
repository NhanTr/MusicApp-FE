import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePagedSearch } from "@/features/catalog/usePagedSearch";
import Artwork from "@/components/music/Artwork";
import { albumsApi } from "@/lib/api";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import {
  CollectionFooter,
  CollectionHero,
  CollectionToolbar,
  EmptyState,
  RecordAside,
  TrackList,
} from "@/components/music/Collection";
export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [query, setQuery] = useState("");
  const likedIds = useLikedSongs();
  const related = usePagedSearch(
    ({ page, size }) =>
      album?.artist?.id
        ? albumsApi.getAlbums({ artistId: album.artist.id, page, size })
        : Promise.resolve({ content: [], totalPages: 0, totalElements: 0 }),
    { initialSize: 4, dependencies: [album?.artist?.id] },
  );
  useEffect(() => {
    let active = true;
    albumsApi
      .getAlbumById(albumId)
      .then((data) => {
        if (active) {
          setAlbum(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Không tải được album.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [albumId]);
  const songs = useMemo(
    () =>
      (album?.songs || []).filter((song) =>
        `${song.title} ${song.artist?.name || ""}`
          .toLocaleLowerCase("vi")
          .includes(query.toLocaleLowerCase("vi")),
      ),
    [album, query],
  );
  return (
    <div className="collection-page">
      <CollectionHero
        title={album?.name || "Album"}
        eyebrow="ALBUM · TRỌN VẸN TỪNG GIAI ĐIỆU"
        image={album?.coverUrl}
        artist={album?.artist?.name || "MusicFlow"}
        count={album?.totalSongs}
        duration={album?.totalDuration}
        description="Một thế giới của riêng nghệ sĩ. Nhấn phát và cảm nhận."
      />
      <CollectionToolbar query={query} onQueryChange={setQuery} songs={songs} />
      <div className="collection-body">
        <div>
          <TrackList
            songs={songs}
            loading={loading}
            error={error}
            likedIds={likedIds}
          />
          {!loading && !error && !songs.length && (
            <EmptyState
              type={query ? "search" : "music"}
              title={query ? "Không tìm thấy bài hát" : "Album chưa có bài hát"}
              description={
                query
                  ? "Thử tên bài hát hoặc nghệ sĩ khác."
                  : "Những giai điệu mới sẽ sớm xuất hiện tại đây."
              }
            />
          )}
          <Link
            to="/music/albums"
            className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground"
          >
            <ArrowLeft size={14} />
            Tất cả album
          </Link>
        </div>
        <RecordAside
          title={album?.name || "Album"}
          artist={album?.artist?.name}
          image={album?.coverUrl}
        />
      </div>
      <div className="section-topline">
        <h2>Cùng nghệ sĩ</h2>
        <Link to="/music/albums" className="text-xs text-primary">
          Khám phá album ↗
        </Link>
      </div>
      <div className="catalog-grid">
        {related.items
          .filter((item) => item.id !== albumId)
          .map((item) => (
            <Link
              className="album-card"
              key={item.id}
              to={`/music/albums/${item.id}`}
            >
              <Artwork src={item.coverUrl} title={item.name} />
              <h3>{item.name}</h3>
              <p>{item.artist?.name}</p>
            </Link>
          ))}
      </div>
      <CollectionFooter />
    </div>
  );
}
