import { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioLines,
  ListMusic,
  Loader2,
  Pause,
  Play,
  Plus,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { apiUtils, playlistsApi } from "@/lib/api";
import { useMusic } from "@/contexts/MusicContext";
import { useListenTracker } from "@/hooks/useListenTracker";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import {
  resolveSongArtistName,
  resolveSongId,
  resolveSongTitle,
} from "@/lib/song-utils";
import { formatTime } from "@/lib/format";
import Artwork from "@/components/music/Artwork";
import LikeButton from "@/components/LikeButton";

function QueuePanel({ onClose }) {
  const {
    queue,
    currentSong,
    selectQueueSong,
    isShuffling,
    toggleShuffle,
    repeatMode,
    setRepeatMode,
  } = useMusic();
  const panelRef = useDialogFocus(true, onClose);
  const index = queue.findIndex(
    (s) => resolveSongId(s) === resolveSongId(currentSong),
  );
  const upcoming = queue.slice(index + 1);
  return (
    <section
      className="queue-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="queue-title"
      ref={panelRef}
    >
      <header>
        <h2 id="queue-title">Hàng đợi của bạn</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Đóng hàng đợi"
        >
          <X size={20} />
        </button>
      </header>
      <p className="eyebrow">ĐANG ĐƯỢC CHỌN</p>
      {currentSong && (
        <div className="queue-current">
          <Artwork
            src={currentSong.coverUrl}
            title={resolveSongTitle(currentSong)}
          />
          <div className="min-w-0 flex-1">
            <strong className="block truncate">
              {resolveSongTitle(currentSong)}
            </strong>
            <p className="truncate">{resolveSongArtistName(currentSong)}</p>
          </div>
          <AudioLines size={17} className="text-primary" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="eyebrow">TIẾP THEO · {upcoming.length} BÀI HÁT</p>
        <button
          className={`icon-button queue-shuffle-control ${isShuffling ? "is-active" : ""}`}
          onClick={toggleShuffle}
          aria-label="Ngẫu nhiên hàng đợi"
          aria-pressed={isShuffling}
        >
          <Shuffle size={17} />
        </button>
        <button
          className={`icon-button ${repeatMode !== "none" ? "is-active" : ""}`}
          aria-label={`Chế độ lặp lại: ${repeatMode}`}
          onClick={() =>
            setRepeatMode((mode) =>
              mode === "none" ? "all" : mode === "all" ? "one" : "none",
            )
          }
        >
          {repeatMode === "one" ? <Repeat1 size={17} /> : <Repeat size={17} />}
        </button>
      </div>
      <div className="queue-scroll">
        {upcoming.length ? (
          upcoming.map((song, i) => (
            <button
              className="queue-item"
              key={resolveSongId(song)}
              onClick={() => selectQueueSong(song)}
            >
              <span>{String(index + i + 2).padStart(2, "0")}</span>
              <div>
                <strong>{resolveSongTitle(song)}</strong>
                <small>{resolveSongArtistName(song)}</small>
              </div>
              <span>{formatTime(song.duration)}</span>
            </button>
          ))
        ) : (
          <p className="py-10 text-center text-xs text-muted-foreground">
            Bạn đã đến cuối bộ sưu tập.
          </p>
        )}
      </div>
      {isShuffling && (
        <p className="queue-shuffle-note">ĐANG BẬT CHẾ ĐỘ PHÁT NGẪU NHIÊN</p>
      )}
    </section>
  );
}
function PlaylistDialog({ song, onClose }) {
  const [playlists, setPlaylists] = useState([]),
    [loading, setLoading] = useState(true),
    [selected, setSelected] = useState(""),
    [saving, setSaving] = useState(false),
    [message, setMessage] = useState("");
  const panelRef = useDialogFocus(true, onClose);
  useEffect(() => {
    let active = true;
    playlistsApi
      .getPlaylists({ size: 100 })
      .then((data) => {
        if (active) {
          const items = apiUtils.extractList(data);
          setPlaylists(items);
          setSelected(items[0]?.id || "");
        }
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function add() {
    setSaving(true);
    setMessage("");
    try {
      await playlistsApi.addSongIntoPlaylist(selected, {
        songId: resolveSongId(song),
      });
      setMessage("Đã thêm bài hát vào playlist.");
    } catch (error) {
      setMessage(error.message || "Không thêm được bài hát.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div
      className="dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="music-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="playlist-dialog-title"
        ref={panelRef}
      >
        <header>
          <h2 id="playlist-dialog-title">Lưu vào playlist</h2>
          <button className="icon-button" onClick={onClose} aria-label="Đóng">
            <X size={19} />
          </button>
        </header>
        <p>{resolveSongTitle(song)}</p>
        {loading ? (
          <p role="status">Đang tải playlist…</p>
        ) : playlists.length ? (
          <>
            <label className="eyebrow" htmlFor="player-playlist">
              CHỌN PLAYLIST
            </label>
            <select
              id="player-playlist"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <p>Bạn chưa có playlist. Hãy tạo playlist trong thư viện.</p>
        )}
        {message && (
          <p className="mt-4" role="status">
            {message}
          </p>
        )}
        <footer>
          <button className="secondary-button" onClick={onClose}>
            Đóng
          </button>
          <button
            className="primary-button"
            onClick={add}
            disabled={!selected || saving}
          >
            {saving ? (
              <Loader2 size={16} className="loading-pulse" />
            ) : (
              <Plus size={16} />
            )}
            Thêm bài hát
          </button>
        </footer>
      </section>
    </div>
  );
}
export default function MusicPlay() {
  const {
    currentSong,
    queue,
    isPlaying,
    setIsPlaying,
    isShuffling,
    toggleShuffle,
    repeatMode,
    setRepeatMode,
    nextSong,
    previousSong,
  } = useMusic();
  const audioRef = useRef(null);
  const [time, setTime] = useState(0),
    [duration, setDuration] = useState(0),
    [volume, setVolume] = useState(0.75),
    [queueOpen, setQueueOpen] = useState(false),
    [playlistOpen, setPlaylistOpen] = useState(false),
    [error, setError] = useState("");
  const closeQueue = useCallback(() => setQueueOpen(false), []),
    closePlaylist = useCallback(() => setPlaylistOpen(false), []);
  const source = currentSong?.fileUrl || currentSong?.url || "";
  useListenTracker(audioRef, currentSong);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let active = true;
    if (isPlaying && source) {
      const attempt = audio.play();
      attempt?.catch((e) => {
        if (active && e.name !== "AbortError") {
          setError(
            "Không thể phát bài hát này. Hãy thử lại hoặc chọn bài khác.",
          );
          setIsPlaying(false);
        }
      });
    } else audio.pause();
    return () => {
      active = false;
    };
  }, [source, isPlaying, setIsPlaying]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    function shortcut(event) {
      if (
        event.code !== "Space" ||
        event.repeat ||
        queueOpen ||
        playlistOpen ||
        event.target.closest(
          'button,a,input,textarea,select,[contenteditable="true"]',
        )
      )
        return;
      event.preventDefault();
      if (source) setIsPlaying((value) => !value);
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [source, setIsPlaying, queueOpen, playlistOpen]);
  function ended() {
    if (repeatMode === "one" || (repeatMode === "all" && queue.length === 1)) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()?.catch(() => setIsPlaying(false));
    } else nextSong(true);
  }
  function previous() {
    if (audioRef.current?.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    previousSong();
  }
  function seek(value) {
    if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = Number(value);
      setTime(Number(value));
    }
  }
  const toggle = () => {
    setError("");
    if (source) setIsPlaying((value) => !value);
  };
  const ready = !!source;
  return (
    <>
      <audio
        ref={audioRef}
        src={source || undefined}
        preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(
            Number.isFinite(e.currentTarget.duration)
              ? e.currentTarget.duration
              : 0,
          );
          setTime(0);
          setError("");
        }}
        onEnded={ended}
        onError={() => {
          if (source) {
            setError("Không tải được tệp âm thanh. Vui lòng chọn bài khác.");
            setIsPlaying(false);
          }
        }}
      />
      {queueOpen && <QueuePanel onClose={closeQueue} />}
      {playlistOpen && currentSong && (
        <PlaylistDialog song={currentSong} onClose={closePlaylist} />
      )}
      <section className="music-player" aria-label="Trình phát nhạc">
        {error && (
          <p className="player-error" role="alert">
            {error}
            <button
              aria-label="Ẩn thông báo"
              className="ml-3"
              onClick={() => setError("")}
            >
              ×
            </button>
          </p>
        )}
        <div className="player-song">
          <Artwork
            className="player-art"
            src={currentSong?.coverUrl}
            title={currentSong ? resolveSongTitle(currentSong) : "MusicFlow"}
          />
          <div className="player-song-info">
            <strong>
              {currentSong
                ? resolveSongTitle(currentSong)
                : "Chọn một giai điệu"}
            </strong>
            <span>
              {currentSong
                ? resolveSongArtistName(currentSong)
                : "Âm nhạc đang chờ bạn"}
            </span>
          </div>
          {currentSong && <LikeButton songId={resolveSongId(currentSong)} />}
        </div>
        <div className="player-center">
          <div className="player-buttons">
            <button
              className={`icon-button shuffle-control ${isShuffling ? "is-active" : ""}`}
              onClick={toggleShuffle}
              disabled={!currentSong}
              aria-label="Phát ngẫu nhiên"
              aria-pressed={isShuffling}
            >
              <Shuffle size={16} />
            </button>
            <button
              className="icon-button"
              onClick={previous}
              disabled={!ready}
              aria-label="Bài trước"
            >
              <SkipBack size={17} fill="currentColor" />
            </button>
            <button
              className="player-toggle"
              onClick={toggle}
              disabled={!ready}
              aria-label={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            >
              {isPlaying ? (
                <Pause size={17} fill="currentColor" />
              ) : (
                <Play size={17} fill="currentColor" className="ml-0.5" />
              )}
            </button>
            <button
              className="icon-button"
              onClick={() => nextSong()}
              disabled={!ready}
              aria-label="Bài tiếp theo"
            >
              <SkipForward size={17} fill="currentColor" />
            </button>
            <button
              className={`icon-button repeat-control ${repeatMode !== "none" ? "is-active" : ""}`}
              onClick={() =>
                setRepeatMode((mode) =>
                  mode === "none" ? "all" : mode === "all" ? "one" : "none",
                )
              }
              disabled={!ready}
              aria-label={`Lặp lại: ${repeatMode}`}
              title={`Lặp lại: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <Repeat1 size={16} />
              ) : (
                <Repeat size={16} />
              )}
            </button>
          </div>
          <div className="player-progress">
            <span>{formatTime(time)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step=".1"
              value={Math.min(time, duration || 0)}
              onChange={(e) => seek(e.target.value)}
              disabled={!duration}
              aria-label="Vị trí phát"
            />
            <span>{formatTime(duration || currentSong?.duration)}</span>
          </div>
        </div>
        <div className="player-tools">
          <span className="player-quality">STEREO</span>
          <button
            className="icon-button playlist-control"
            onClick={() => {
              setQueueOpen(false);
              setPlaylistOpen(true);
            }}
            disabled={!currentSong}
            aria-label="Thêm vào playlist"
          >
            <Plus size={17} />
          </button>
          <button
            className={`icon-button ${queueOpen ? "is-active" : ""}`}
            onClick={() => setQueueOpen((value) => !value)}
            aria-label="Mở hàng đợi"
            aria-expanded={queueOpen}
          >
            <ListMusic size={18} />
          </button>
          <div className="player-volume">
            <button
              onClick={() => setVolume((v) => (v ? 0 : 0.75))}
              aria-label={volume ? "Tắt tiếng" : "Bật tiếng"}
            >
              {volume ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step=".05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Âm lượng"
            />
          </div>
        </div>
      </section>
    </>
  );
}
