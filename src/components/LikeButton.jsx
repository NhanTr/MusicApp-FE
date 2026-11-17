import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { favoritesApi, fetchWithAuthJson } from "@/lib/api";
export default function LikeButton({ songId, initialLiked, onLikeChange }) {
  const [status, setStatus] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const liked = status?.songId === songId ? status.liked : !!initialLiked;
  useEffect(() => {
    let active = true;
    if (initialLiked === undefined && songId)
      fetchWithAuthJson(`/api/favorites/${songId}/status`)
        .then((data) => {
          if (active) setStatus({ songId, liked: !!data?.liked });
        })
        .catch(() => {});
    function changed(event) {
      if (event.detail.songId === songId) setStatus(event.detail);
    }
    window.addEventListener("musicflow:favorite", changed);
    return () => {
      active = false;
      window.removeEventListener("musicflow:favorite", changed);
    };
  }, [songId, initialLiked]);
  async function toggle(event) {
    event.stopPropagation();
    if (busy || !songId) return;
    setBusy(true);
    setError("");
    try {
      if (liked) await favoritesApi.unlikeSong(songId);
      else await favoritesApi.likeSong(songId);
      const next = { songId, liked: !liked };
      setStatus(next);
      window.dispatchEvent(
        new CustomEvent("musicflow:favorite", { detail: next }),
      );
      onLikeChange?.(!liked);
    } catch (err) {
      setError(err.message || "Không cập nhật được yêu thích");
    } finally {
      setBusy(false);
    }
  }
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={toggle}
        disabled={busy || !songId}
        aria-label={liked ? "Bỏ yêu thích" : "Yêu thích bài hát"}
        aria-pressed={liked}
        title={error || (liked ? "Bỏ yêu thích" : "Thêm vào yêu thích")}
      >
        <Heart
          size={17}
          strokeWidth={1.7}
          fill={liked ? "currentColor" : "none"}
        />
      </button>
      {error && (
        <span role="alert" className="sr-only">
          {error}
        </span>
      )}
    </span>
  );
}
