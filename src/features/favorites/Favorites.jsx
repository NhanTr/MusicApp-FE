import { useEffect, useMemo, useState } from 'react'
import { Heart, Play, RefreshCw, Trash2 } from 'lucide-react'

import { favoritesApi, apiUtils } from '@/lib/api'
import { useMusic } from '@/contexts/MusicContext'
import { resolveSongArtistName, resolveSongEntity, resolveSongId, resolveSongListenerCount, resolveSongTitle } from '@/lib/song-utils'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mới thích nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'listeners-desc', label: 'Nghe nhiều nhất' },
  { value: 'listeners-asc', label: 'Nghe ít nhất' },
]

export default function Favorites() {
  const { setCurrentSong } = useMusic()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [sortBy, setSortBy] = useState('recent')

  async function loadFavorites(nextPage = 0, append = false) {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError('')

    try {
      const data = await favoritesApi.getFavorites({ page: nextPage, size: pageSize, q: query })
      const items = apiUtils.extractList(data)
      const resolvedTotalPages = data?.data?.totalPages || data?.totalPages || 1
      const resolvedTotalElements = data?.totalElements ?? data?.data?.totalElements ?? items.length

      setTotalPages(resolvedTotalPages)
      setTotalElements(resolvedTotalElements)
      setPage(nextPage)
      setFavorites((prev) => (append ? [...prev, ...items] : items))
    } catch (err) {
      setError(err.message || 'Không tải được danh sách yêu thích.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadFavorites(0, false)
  }, [pageSize, query])

  async function handleUnlike(songId) {
    try {
      await favoritesApi.unlikeSong(songId)
      await loadFavorites(0, false)
    } catch (err) {
      setError(err.message || 'Không xóa được khỏi yêu thích.')
    }
  }

  const displayedFavorites = useMemo(() => {
    const items = [...favorites]
    items.sort((left, right) => {
      const leftSong = resolveSongEntity(left)
      const rightSong = resolveSongEntity(right)
      const leftListenerCount = resolveSongListenerCount(leftSong)
      const rightListenerCount = resolveSongListenerCount(rightSong)
      const leftTime = new Date(left.addedAt || 0).getTime()
      const rightTime = new Date(right.addedAt || 0).getTime()

      switch (sortBy) {
        case 'oldest':
          return leftTime - rightTime
        case 'listeners-desc':
          return rightListenerCount - leftListenerCount
        case 'listeners-asc':
          return leftListenerCount - rightListenerCount
        case 'recent':
        default:
          return rightTime - leftTime
      }
    })
    return items
  }, [favorites, sortBy])

  const hasMore = totalPages > 0 ? page + 1 < totalPages : favorites.length < totalElements

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Yêu Thích</h1>
        <p className="text-slate-600 mt-2">Tìm và lọc các bài hát đã thích theo dữ liệu DB.</p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Tìm kiếm</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên bài hát, nghệ sĩ, album"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Số lượng</span>
          <input
            type="number"
            min="1"
            step="1"
            value={pageSize}
            onChange={(event) => setPageSize(Math.max(1, Number(event.target.value) || 1))}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Sắp xếp</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{loading ? 'Đang tải...' : `Hiển thị ${displayedFavorites.length}/${totalElements || displayedFavorites.length} bài hát`}</span>
        <button
          type="button"
          onClick={() => loadFavorites(0, false)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Tải lại
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Đang tải danh sách yêu thích...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3 rounded-xl border bg-white p-5 shadow-sm">
          {displayedFavorites.map((favorite) => {
            const song = resolveSongEntity(favorite)
            const title = resolveSongTitle(song)
            const artistName = resolveSongArtistName(song)
            const songId = resolveSongId(favorite)
            const listenerCount = resolveSongListenerCount(song)

            return (
              <div
                key={favorite.id || songId || title}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <button type="button" onClick={() => setCurrentSong(song)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <Heart className="w-4 h-4 text-red-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{title}</p>
                    <p className="text-sm text-slate-500 truncate">{artistName}</p>
                    <p className="text-xs text-slate-400 truncate">{listenerCount} lượt nghe</p>
                  </div>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentSong(song)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-white"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnlike(songId)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}

          {!displayedFavorites.length && <p className="text-sm text-slate-500">Chưa có bài hát yêu thích nào.</p>}

          {hasMore && (
            <button
              type="button"
              onClick={() => loadFavorites(page + 1, true)}
              disabled={loadingMore}
              className="mx-auto inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loadingMore ? 'Đang tải thêm...' : 'Tải thêm'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
