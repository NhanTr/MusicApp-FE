import { useEffect, useRef, useState } from 'react'
import { Music2 } from 'lucide-react'

import { useMusic } from '@/contexts/MusicContext'

export default function Trending() {
  const { songs, songsLoading, songsError, reloadSongs, setCurrentSong } = useMusic()
  const INITIAL_LIMIT = 5
  const LOAD_MORE_STEP = 5
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT)
  const listRef = useRef(null)

  const displayedSongs = songs.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(INITIAL_LIMIT)
  }, [songs])

  function handleListScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 16

    if (isNearBottom && visibleCount < songs.length) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, songs.length))
    }
  }

  useEffect(() => {
    if (songsLoading || songsError || visibleCount >= songs.length) {
      return
    }

    const listEl = listRef.current
    if (!listEl) {
      return
    }

    const hasOverflow = listEl.scrollHeight > listEl.clientHeight + 2

    if (!hasOverflow) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, songs.length))
    }
  }, [songsLoading, songsError, songs.length, visibleCount])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Nhạc Xu Hướng</h1>
        <p className="text-slate-600 mt-2">Các bài hát đang được nghe nhiều nhất.</p>
      </div>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        {songsLoading && <p className="text-sm text-slate-500">Đang tải bài hát...</p>}
        {songsError && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-red-600">{songsError}</p>
            <button
              type="button"
              onClick={reloadSongs}
              className="text-xs font-medium text-red-700 hover:text-red-800"
            >
              Tải lại
            </button>
          </div>
        )}

        {!songsLoading && !songsError && (
          <>
            <div className="mb-3 text-xs text-slate-500">
              Hiển thị {displayedSongs.length}/{songs.length} bài hát
            </div>

            <div
              ref={listRef}
              className="max-h-[55vh] overflow-y-auto pr-1 space-y-2"
              onScroll={handleListScroll}
            >
              {displayedSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => setCurrentSong(song)}
                className="cursor-pointer flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100"
              >
                <Music2 className="w-4 h-4 text-red-700" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">{song.title || song.name || song.songName || 'Untitled song'}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {song.artist?.name || song.artist || 'Unknown artist'}
                  </p>
                </div>
              </div>
              ))}

              {!songs.length && <p className="text-sm text-slate-500">Chưa có bài hát nào.</p>}

              {visibleCount < songs.length && (
                <p className="text-xs text-slate-400 text-center py-2">Kéo xuống để tải thêm...</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}