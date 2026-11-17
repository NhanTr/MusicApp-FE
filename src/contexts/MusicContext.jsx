import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiUtils, songsApi, historyApi } from "@/lib/api";
import {
  createQueue,
  nextQueueIndex,
  shuffleQueue,
  songKey,
} from "@/lib/queue";
const MusicContext = createContext(null);
export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [queue, setQueue] = useState([]);
  const collectionQueue = useRef([]);
  const [currentSong, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none");
  const [songsLoading, setSongsLoading] = useState(true);
  const [songsError, setSongsError] = useState("");
  const loadSongs = useCallback(async () => {
    setSongsLoading(true);
    setSongsError("");
    try {
      const data = await songsApi.getTrendingSongs({ size: 30 });
      const items = apiUtils.extractList(data);
      setSongs(items);
      if (!collectionQueue.current.length) collectionQueue.current = items;
      setQueue((prev) => (prev.length ? prev : items));
      setCurrent((prev) => prev || items[0] || null);
    } catch (error) {
      setSongsError(error.message || "Không tải được danh sách bài hát.");
    } finally {
      setSongsLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(loadSongs, 0);
    return () => clearTimeout(timer);
  }, [loadSongs]);
  const record = useCallback((song) => {
    if (songKey(song))
      historyApi.addHistory({ songId: songKey(song) }).catch(() => {});
  }, []);
  const setCurrentSong = useCallback(
    (song, collection) => {
      if (!song) return;
      if (collection) {
        const ordered = createQueue(collection, song);
        collectionQueue.current = ordered;
        setQueue(ordered);
        setShuffling(false);
      } else {
        collectionQueue.current = createQueue(
          collectionQueue.current.length ? collectionQueue.current : songs,
          song,
        );
        setQueue((prev) => createQueue(prev.length ? prev : songs, song));
      }
      setCurrent(song);
      setIsPlaying(true);
      record(song);
    },
    [songs, record],
  );
  const playCollection = useCallback(
    (collection, shuffle = false) => {
      if (!collection.length) return;
      const clean = createQueue(collection);
      if (!clean.length) return;
      collectionQueue.current = clean;
      const next = shuffle ? shuffleQueue(clean, null) : clean;
      setQueue(next);
      setCurrent(next[0]);
      setShuffling(shuffle);
      setIsPlaying(true);
      record(next[0]);
    },
    [record],
  );
  const selectQueueSong = useCallback(
    (song) => {
      setCurrent(song);
      setIsPlaying(true);
      record(song);
    },
    [record],
  );
  const nextSong = useCallback(
    (ended = false) => {
      const index = queue.findIndex((s) => songKey(s) === songKey(currentSong));
      const next = nextQueueIndex(
        index,
        queue.length,
        ended ? repeatMode : repeatMode === "all" ? "all" : "none",
      );
      if (next < 0) {
        setIsPlaying(false);
        return;
      }
      selectQueueSong(queue[next]);
    },
    [queue, currentSong, repeatMode, selectQueueSong],
  );
  const previousSong = useCallback(() => {
    const index = queue.findIndex((s) => songKey(s) === songKey(currentSong));
    if (queue.length) selectQueueSong(queue[Math.max(0, index - 1)]);
  }, [queue, currentSong, selectQueueSong]);
  const toggleShuffle = useCallback(() => {
    setQueue((prev) =>
      isShuffling
        ? createQueue(collectionQueue.current, currentSong)
        : shuffleQueue(prev, currentSong),
    );
    setShuffling((v) => !v);
  }, [isShuffling, currentSong]);
  return (
    <MusicContext.Provider
      value={{
        songs,
        queue,
        currentSong,
        setCurrentSong,
        selectQueueSong,
        playCollection,
        nextSong,
        previousSong,
        isPlaying,
        setIsPlaying,
        isShuffling,
        toggleShuffle,
        repeatMode,
        setRepeatMode,
        songsLoading,
        songsError,
        reloadSongs: loadSongs,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
// Kept beside the provider so the existing feature imports remain compatible.
// eslint-disable-next-line react-refresh/only-export-components
export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
}
export default MusicContext;
