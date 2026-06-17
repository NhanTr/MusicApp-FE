import { useEffect, useMemo, useState } from 'react'
import { Music2, RefreshCw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { useMusic } from '@/contexts/MusicContext'
import LikeButton from '@/components/LikeButton'
import { apiUtils, favoritesApi, songsApi } from '@/lib/api'
import { usePagedSearch } from '@/features/catalog/usePagedSearch'
import { resolveSongListenerCount } from '@/lib/song-utils'

const SORT_OPTIONS = [
  { value: 'listeners-desc', label: 'Nghe nhiều nhất' },
  { value: 'listeners-asc', label: 'Nghe ít nhất' },
  { value: 'title-asc', label: 'Tên A-Z' },
  { value: 'title-desc', label: 'Tên Z-A' },
]

export default function Trending() {
  const { setCurrentSong } = useMusic()
  const [searchParams] = useSearchParams()
  const [likedSongs, setLikedSongs] = useState(new Set())
  const [sortBy, setSortBy] = useState('listeners-desc')

  const searchQuery = searchParams.get('search')?.trim() || ''

  // ✅ Dùng usePagedSearch giống SongsPage — không còn tự quản lý page/totalPages/songs thủ công
  const catalog = usePagedSearch(
    async ({ query, page, size }) => {
      if (query) {
        return songsApi.searchSongs(query, { page, size })
      }

      return songsApi.getSongs({ page, size, sort: 'createdAt,desc' })
    },
    { initialSize: 5 },
  )

  // ✅ Lọc client-side theo URL search param (giữ lại tính năng cũ)
  const filteredSongs = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase()
    if (!keyword) return catalog.items

    return catalog.items.filter((song) => {
      const title = (song.title || song.name || song.songName || '').toLowerCase()
      const artistName = (typeof song.artist === 'string' ? song.artist : song.artist?.name || '').toLowerCase()
      const albumName = (song.album?.name || '').toLowerCase()
      return title.includes(keyword) || artistName.includes(keyword) || albumName.includes(keyword)
    })
  }, [catalog.items, searchQuery])

  // ✅ Sort giống SongsPage
  const displayedSongs = useMemo(() => {
    const items = [...filteredSongs]
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
  }, [filteredSongs, sortBy])

  // Load favorites
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Nhạc Xu Hướng</h1>
        <p className="text-slate-600 mt-2">Các bài hát đang được nghe nhiều nhất.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px] mb-4">
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Từ khóa</span>
            <input
              value={catalog.query}
              onChange={(event) => catalog.setQuery(event.target.value)}
              placeholder="Đang lọc theo tham số URL search"
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

        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500">
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

        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            {catalog.loading
              ? 'Đang tải...'
              : `Hiển thị ${displayedSongs.length}/${catalog.totalElements || catalog.items.length} bài hát`}
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

        {catalog.error && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-red-600">{catalog.error}</p>
            <button
              type="button"
              onClick={catalog.reload}
              className="text-xs font-medium text-red-700 hover:text-red-800"
            >
              Tải lại
            </button>
          </div>
        )}

        <div className="space-y-2">
          {displayedSongs.map((song) => {
            const songId = song.id || song._id
            return (
              <div
                key={songId}
                onClick={() => setCurrentSong(song)}
                className="group cursor-pointer flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition"
              >
                <Music2 className="w-4 h-4 text-red-700 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">
                    {song.title || song.name || song.songName || 'Untitled song'}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {song.artist?.name || song.artist || 'Unknown artist'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{resolveSongListenerCount(song)} lượt nghe</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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

          {!catalog.loading && !catalog.error && !displayedSongs.length && (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
              Chưa có bài hát nào.
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