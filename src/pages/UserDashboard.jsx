import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { albumsApi, apiUtils } from "@/lib/api";
import { useMusic } from "@/contexts/MusicContext";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import {
  CollectionFooter,
  CollectionHero,
  CollectionToolbar,
  EmptyState,
  RecordAside,
  TrackList,
} from "@/components/music/Collection";
import Artwork from "@/components/music/Artwork";
export default function UserDashboard() {
  const { songs, songsLoading, songsError } = useMusic();
  const likedIds = useLikedSongs();
  const [albums, setAlbums] = useState([]),
    [query, setQuery] = useState("");
  useEffect(() => {
    let active = true;
    albumsApi
      .getAlbums({ size: 4 })
      .then((data) => {
        if (active) setAlbums(apiUtils.extractList(data));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const featured = albums[0];
  const filtered = songs.filter((song) =>
    `${song.title} ${song.artist?.name || song.artist || ""}`
      .toLocaleLowerCase("vi")
      .includes(query.toLocaleLowerCase("vi")),
  );
  return (
    <div className="dashboard-page">
      <div className="dashboard-greeting">
        <p className="eyebrow">MỘT NGÀY MỚI. MỘT GIAI ĐIỆU MỚI.</p>
        <p>Âm nhạc dành cho khoảnh khắc này.</p>
      </div>
      <CollectionHero
        title="Giai điệu hôm nay"
        eyebrow="KHÁM PHÁ · ĐỂ ÂM NHẠC DẪN LỐI"
        image={featured?.coverUrl || songs[0]?.coverUrl}
        artist="MusicFlow Selection"
        count={songs.length}

        description="Một thế giới của riêng bạn. Nhấn phát và bước vào."
      />
      <CollectionToolbar
        query={query}
        onQueryChange={setQuery}
        songs={filtered}
      />
      <div className="collection-body">
        <div>
          <TrackList
            songs={filtered}
            likedIds={likedIds}
            loading={songsLoading}
            error={songsError}
          />
          {!songsLoading && !songsError && !filtered.length && (
            <EmptyState
              title={query ? "Không tìm thấy bài hát" : "Thư viện đang chờ bạn"}
              description={
                query
                  ? "Thử tìm bằng tên bài hát hoặc nghệ sĩ khác."
                  : "Khám phá album hoặc tải lên giai điệu đầu tiên."
              }
              action={
                !query
                  ? { to: "/music/upload", label: "Tải nhạc của bạn" }
                  : null
              }
            />
          )}
          <div className="section-topline">
            <h2>Khám phá album</h2>
            <Link to="/music/albums">
              Xem tất cả
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="album-grid">
            {albums.map((album) => (
              <Link
                className="album-card"
                key={album.id}
                to={`/music/albums/${album.id}`}
              >
                <Artwork src={album.coverUrl} title={album.name} />
                <h3>{album.name}</h3>
                <p>{album.artist?.name || "Album"}</p>
              </Link>
            ))}
          </div>
        </div>
        <RecordAside
          image={featured?.coverUrl || songs[0]?.coverUrl}
          title={featured?.name || "Bật nhạc. Thả lỏng."}
          artist={featured?.artist?.name || "Your listening room"}
        />
      </div>
      <CollectionFooter />
    </div>
  );
}
