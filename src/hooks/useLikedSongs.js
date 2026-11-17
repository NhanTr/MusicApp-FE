import { useEffect, useState } from "react";
import { apiUtils, favoritesApi } from "@/lib/api";
import { resolveSongId } from "@/lib/song-utils";
export function useLikedSongs() {
  const [likedIds, setLikedIds] = useState(new Set());
  useEffect(() => {
    let active = true;
    favoritesApi
      .getFavorites({ size: 1000 })
      .then((data) => {
        if (active)
          setLikedIds(new Set(apiUtils.extractList(data).map(resolveSongId)));
      })
      .catch(() => {});
    function changed(event) {
      setLikedIds((previous) => {
        const next = new Set(previous);
        if (event.detail.liked) next.add(event.detail.songId);
        else next.delete(event.detail.songId);
        return next;
      });
    }
    window.addEventListener("musicflow:favorite", changed);
    return () => {
      active = false;
      window.removeEventListener("musicflow:favorite", changed);
    };
  }, []);
  return likedIds;
}
