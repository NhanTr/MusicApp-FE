import { useEffect, useMemo, useState } from 'react'
import { Music2, Play, RefreshCw } from 'lucide-react'

import LikeButton from '@/components/LikeButton'
import { useMusic } from '@/contexts/MusicContext'
import { apiUtils, favoritesApi, songsApi } from '@/lib/api'
import { usePagedSearch } from '@/features/catalog/usePagedSearch'
import { resolveSongListenerCount } from '@/lib/song-utils'

const SORT_OPTIONS = [
  { value: 'listeners-desc', label: 'Nghe nhiều nhất' },
  { value: 'listeners-asc', label: 'Nghe ít nhất' },
  { value: 'title-asc', label: 'Tên A-Z' },
  { value: 'title-desc', label: 'Tên Z-A' },
]

export default function SongsPage() {
  const { setCurrentSong } = useMusic()
  const [likedSongs, setLikedSongs] = useState(new Set())
  const [sortBy, setSortBy] = useState('listeners-desc')

  const catalog = usePagedSearch(
    async ({ query, page, size }) => {
      if (query) {
        return songsApi.searchSongs(query, { page, size })
      }

      return songsApi.getSongs({ page, size, sort: 'createdAt,desc' })
    },
    { initialSize: 5 },
  )

  const sortedSongs = useMemo(() => {
    const items = [...catalog.items]
    items.sort((left, right) => {
      const leftTitle = (left.title || left.name || left.songName || '').toLowerCase()
      const rightTitle = (right.title || right.name || right.songName || '').toLowerCase()
      const leftListenerCount = resolveSongListenerCount(left)
      const rightListenerCount = resolveSongListenerCount(right)

      switch (sortBy) {
        case 'listeners-asc':
          return leftListenerCount - rightListenerCount
        case 'title-asc':
          return leftTitle.localeCompare(rightTitle)
        case 'title-desc':
          return rightTitle.localeCompare(leftTitle)
        case 'listeners-desc':
        default:
          return rightListenerCount - leftListenerCount
      }
    })
    return items
  }, [catalog.items, sortBy])

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await favoritesApi.getFavorites({ size: 5 })
        const favoriteIds = new Set(
          apiUtils.extractList(favorites).map((song) => song.id || song._id),
        )
        setLikedSongs(favoriteIds)
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }

    loadFavorites()
  }, [])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
          <Music2 className="h-4 w-4" />
          Songs
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Bài hát</h1>
        <p className="text-slate-600"></p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Tìm kiếm</span>
            <input
              value={catalog.query}
              onChange={(event) => catalog.setQuery(event.target.value)}
              placeholder="Tìm theo tên bài hát, nghệ sĩ hoặc album"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Số lượng</span>
            <input
              type="number"
              min="1"
              step="1"
              value={catalog.pageSize}
              onChange={(event) => catalog.setPageSize(Math.max(1, Number(event.target.value) || 1))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-4 mb-2 flex items-center justify-between gap-3 text-sm text-slate-500">
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Sắp xếp</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            {catalog.loading ? 'Đang tải...' : `Hiển thị ${catalog.items.length}/${catalog.totalElements || catalog.items.length} bài hát`}
          </span>
          <button
            type="button"
            onClick={catalog.reload}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </button>
        </div>

        {catalog.error && <p className="mt-3 text-sm text-red-600">{catalog.error}</p>}

        <div className="mt-4 space-y-2">
          {sortedSongs.map((song) => {
            const songId = song.id || song._id
            return (
              <div
                key={songId}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100"
              >
                <button
                  type="button"
                  onClick={() => setCurrentSong(song)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <Music2 className="h-4 w-4 shrink-0 text-red-700" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{song.title || song.name || song.songName || 'Untitled song'}</p>
                    <p className="truncate text-sm text-slate-500">
                      {song.artist?.name || song.artist || 'Unknown artist'}
                    </p>
                    <p className="truncate text-xs text-slate-400">{resolveSongListenerCount(song)} lượt nghe</p>
                  </div>
                </button>

                <Play className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <LikeButton
                    songId={songId}
                    initialLiked={likedSongs.has(songId)}
                    onLikeChange={(isLiked) => {
                      const nextLikedSongs = new Set(likedSongs)
                      if (isLiked) {
                        nextLikedSongs.add(songId)
                      } else {
                        nextLikedSongs.delete(songId)
                      }
                      setLikedSongs(nextLikedSongs)
                    }}
                  />
                </div>
              </div>
            )
          })}

          {!catalog.loading && !catalog.error && !catalog.items.length && (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
              Không có bài hát nào phù hợp.
            </p>
          )}
        </div>

        {catalog.hasMore && !catalog.loading && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={catalog.loadMore}
              disabled={catalog.loadingMore}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {catalog.loadingMore ? 'Đang tải thêm...' : 'Tải thêm'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}