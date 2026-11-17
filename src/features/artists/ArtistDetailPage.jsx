import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { albumsApi, artistsApi, followApi } from "@/lib/api";
import { usePagedSearch } from "@/features/catalog/usePagedSearch";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import {
  CollectionFooter,
  CollectionHero,
  CollectionToolbar,
  EmptyState,
  LoadMore,
  TrackList,
} from "@/components/music/Collection";
import Artwork from "@/components/music/Artwork";
export default function ArtistDetailPage() {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null),
    [error, setError] = useState(""),
    [following, setFollowing] = useState(null),
    [busy, setBusy] = useState(false);
  const likedIds = useLikedSongs();
  const catalog = usePagedSearch(
    ({ page, size }) => artistsApi.getArtistSongs(artistId, { page, size }),
    { initialSize: 20, dependencies: [artistId] },
  );
  const albums = usePagedSearch(
    ({ page, size }) => albumsApi.getAlbums({ artistId, page, size }),
    { initialSize: 8, dependencies: [artistId] },
  );
  useEffect(() => {
    let active = true;
    artistsApi
      .getArtistById(artistId)
      .then((data) => {
        if (active) setArtist(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [artistId]);
  const isFollowing = following ?? artist?.isFollowing ?? false;
  async function toggleFollow() {
    setBusy(true);
    try {
      if (isFollowing) await followApi.unfollowArtist(artistId);
      else await followApi.followArtist(artistId);
      setFollowing(!isFollowing);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="collection-page">
      <CollectionHero
        title={artist?.name || "Nghệ sĩ"}
        eyebrow="NGHỆ SĨ · MỘT CÁ TÍNH ÂM NHẠC"
        image={artist?.avatarUrl}
        artist={artist?.name || "MusicFlow"}
        count={artist?.songCount}
        description={
          artist?.bio || "Khám phá câu chuyện đằng sau từng giai điệu."
        }
      />
      {error && <p className="inline-error">{error}</p>}
      <CollectionToolbar songs={catalog.items}>
        <button
          className="secondary-button"
          onClick={toggleFollow}
          disabled={busy}
        >
          {isFollowing ? "Đang theo dõi" : "Theo dõi nghệ sĩ"}
        </button>
      </CollectionToolbar>
      <TrackList
        songs={catalog.items}
        loading={catalog.loading}
        error={catalog.error}
        likedIds={likedIds}
      />
      {!catalog.loading && !catalog.items.length && (
        <EmptyState type="music" title="Chưa có bài hát" />
      )}
      <LoadMore
        hasMore={catalog.hasMore}
        loading={catalog.loadingMore}
        onClick={catalog.loadMore}
      />
      <div className="section-topline">
        <h2>Album của nghệ sĩ</h2>
      </div>
      <div className="catalog-grid">
        {albums.items.map((album) => (
          <Link
            className="album-card"
            key={album.id}
            to={`/music/albums/${album.id}`}
          >
            <Artwork src={album.coverUrl} title={album.name} />
            <h3>{album.name}</h3>
            <p>{album.totalSongs || 0} bài hát</p>
          </Link>
        ))}
      </div>
      <LoadMore
        hasMore={albums.hasMore}
        loading={albums.loadingMore}
        onClick={albums.loadMore}
      />
      <CollectionFooter />
    </div>
  );
}
