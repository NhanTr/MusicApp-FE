import { useEffect, useMemo, useState } from 'react'
import { Clock3, RefreshCw, Trash2, Trash } from 'lucide-react'

import { historyApi, apiUtils, favoritesApi } from '@/lib/api'
import { useMusic } from '@/contexts/MusicContext'
import LikeButton from '@/components/LikeButton'
import { resolveSongListenerCount } from '@/lib/song-utils'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Mới nghe nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'listeners-desc', label: 'Nghe nhiều nhất' },
  { value: 'listeners-asc', label: 'Nghe ít nhất' },
]

function getHistorySong(item) {
  return item.song || item.music || item.track || item
}

export default function History() {
  const { setCurrentSong } = useMusic()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [likedSongs, setLikedSongs] = useState(new Set())
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [sortBy, setSortBy] = useState('recent')

  async function loadHistory(nextPage = 0, append = false) {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError('')

    try {
      const data = await historyApi.getHistory({ page: nextPage, size: pageSize, q: query })
      const items = apiUtils.extractList(data)
      setTotalPages(data?.totalPages || data?.data?.totalPages || 0)
      setTotalElements(data?.totalElements ?? (data?.data?.totalElements) ?? items.length)
      setPage(nextPage)
      setHistory((prev) => (append ? [...prev, ...items] : items))
    } catch (err) {
      setError(err.message || 'Không tải được lịch sử nghe.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

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
    loadHistory(0, false)
  }, [pageSize, query])

  async function handleDeleteHistory(id) {
    if (!id) return

    try {
      await historyApi.deleteHistoryById(id)
      await loadHistory()
    } catch (err) {
      setError(err.message || 'Không xóa được mục lịch sử.')
    }
  }

  async function handleClearHistory() {
    try {
      await historyApi.deleteAllHistory()
      setHistory([])
    } catch (err) {
      setError(err.message || 'Không xóa được toàn bộ lịch sử.')
    }
  }

  const displayedHistory = useMemo(() => {
    const items = [...history]
    items.sort((left, right) => {
      const leftSong = getHistorySong(left)
      const rightSong = getHistorySong(right)
      const leftListenerCount = resolveSongListenerCount(leftSong)
      const rightListenerCount = resolveSongListenerCount(rightSong)
      const leftTime = new Date(left.listenedAt || 0).getTime()
      const rightTime = new Date(right.listenedAt || 0).getTime()

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
  }, [history, sortBy])

  const hasMore = totalPages > 0 ? page + 1 < totalPages : history.length < totalElements

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Lịch Sử Nghe</h1>
          
        </div>

        <button
          type="button"
          onClick={handleClearHistory}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          <Trash className="w-4 h-4" />
          Xóa tất cả
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <label className="space-y-1 md:col-span-1">
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
        <span>
          {loading ? 'Đang tải...' : `Hiển thị ${displayedHistory.length}/${totalElements || displayedHistory.length} mục`}
        </span>
        <button
          type="button"
          onClick={() => loadHistory(0, false)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Tải lại
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Đang tải lịch sử...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-2 rounded-xl border bg-white p-5 shadow-sm">
          {displayedHistory.map((item) => {
            const song = getHistorySong(item)
            const title = song.title || song.name || song.songName || 'Untitled song'
            const artistName = typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown artist'
            const listenerCount = resolveSongListenerCount(song)
            const timeListened = new Date(item.listenedAt).toLocaleString()

            return (
              <div
                key={item.id || song.id || title}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 group"
              >
                <button
                  type="button"
                  onClick={() => setCurrentSong(song)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <Clock3 className="w-4 h-4 text-red-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{title}</p>
                    <p className="text-sm text-slate-500 truncate">{timeListened}</p>
                    <p className="text-sm text-slate-500 truncate">{artistName}</p>
                    <p className="text-xs text-slate-400 truncate">{listenerCount} lượt nghe</p>
                  </div>
                </button>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <button
                    type="button"
                    onClick={() => handleDeleteHistory(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}

          {!displayedHistory.length && <p className="text-sm text-slate-500">Chưa có lịch sử nghe nào.</p>}

          {hasMore && (
            <button
              type="button"
              onClick={() => loadHistory(page + 1, true)}
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
