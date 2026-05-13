import { useEffect, useMemo, useRef, useState } from 'react'
import { Music2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { useMusic } from '@/contexts/MusicContext'
import LikeButton from '@/components/LikeButton'
import { favoritesApi } from '@/lib/api'

export default function Trending() {
  const { songs, songsLoading, songsError, reloadSongs, setCurrentSong } = useMusic()
  const [searchParams] = useSearchParams()
  const INITIAL_LIMIT = 5
  const LOAD_MORE_STEP = 5
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT)
  const [likedSongs, setLikedSongs] = useState(new Set())
  const listRef = useRef(null)
  const searchQuery = searchParams.get('search')?.trim().toLowerCase() || ''

  const filteredSongs = useMemo(() => {
    if (!searchQuery) return songs

    return songs.filter((song) => {
      const title = (song.title || song.name || song.songName || '').toLowerCase()
      const artistName = (
        typeof song.artist === 'string' ? song.artist : song.artist?.name || ''
      ).toLowerCase()
      const albumName = (song.album?.name || '').toLowerCase()
      return title.includes(searchQuery) || artistName.includes(searchQuery) || albumName.includes(searchQuery)
    })
  }, [songs, searchQuery])

  const displayedSongs = filteredSongs.slice(0, visibleCount)

  // Load user's favorite songs
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await favoritesApi.getFavorites({ size: 1000 })
        const favoriteIds = new Set(
          (Array.isArray(favorites) ? favorites : favorites?.data || []).map(
            (song) => song.id || song._id
          )
        )
        setLikedSongs(favoriteIds)
      } catch (err) {
        console.error('Error loading favorites:', err)
      }
    }

    loadFavorites()
  }, [])

  useEffect(() => {
    setVisibleCount(INITIAL_LIMIT)
  }, [songs, searchQuery])

  function handleListScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 16

    if (isNearBottom && visibleCount < filteredSongs.length) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, filteredSongs.length))
    }
  }

  useEffect(() => {
    if (songsLoading || songsError || visibleCount >= filteredSongs.length) {
      return
    }

    const listEl = listRef.current
    if (!listEl) {
      return
    }

    const hasOverflow = listEl.scrollHeight > listEl.clientHeight + 2

    if (!hasOverflow) {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, filteredSongs.length))
    }
  }, [songsLoading, songsError, filteredSongs.length, visibleCount])

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
              Hiển thị {displayedSongs.length}/{filteredSongs.length} bài hát
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
                className="cursor-pointer flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 group"
              >
                <Music2 className="w-4 h-4 text-red-700 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">{song.title || song.name || song.songName || 'Untitled song'}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {song.artist?.name || song.artist || 'Unknown artist'}
                  </p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <LikeButton
                    songId={song.id || song._id}
                    initialLiked={likedSongs.has(song.id || song._id)}
                    onLikeChange={(isLiked) => {
                      const newLikedSongs = new Set(likedSongs)
                      if (isLiked) {
                        newLikedSongs.add(song.id || song._id)
                      } else {
                        newLikedSongs.delete(song.id || song._id)
                      }
                      setLikedSongs(newLikedSongs)
                    }}
                  />
                </div>
              </div>
              ))}

              {!filteredSongs.length && <p className="text-sm text-slate-500">Chưa có bài hát nào.</p>}

              {visibleCount < filteredSongs.length && (
                <p className="text-xs text-slate-400 text-center py-2">Kéo xuống để tải thêm...</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}