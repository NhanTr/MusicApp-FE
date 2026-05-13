import { useEffect, useState } from 'react'
import { Clock3, Trash2, Trash } from 'lucide-react'

import { historyApi, apiUtils, favoritesApi } from '@/lib/api'
import { useMusic } from '@/contexts/MusicContext'
import LikeButton from '@/components/LikeButton'

function getHistorySong(item) {
  return item.song || item.music || item.track || item
}

export default function History() {
  const { setCurrentSong } = useMusic()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likedSongs, setLikedSongs] = useState(new Set())

  async function loadHistory() {
    setLoading(true)
    setError('')

    try {
      const data = await historyApi.getHistory()
      setHistory(apiUtils.extractList(data))
    } catch (err) {
      setError(err.message || 'Không tải được lịch sử nghe.')
    } finally {
      setLoading(false)
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
    loadHistory()
  }, [])

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

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Lịch Sử Nghe</h1>
          <p className="text-slate-600 mt-2">Xem và quản lý các bài hát đã phát.</p>
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

      {loading && <p className="text-sm text-slate-500">Đang tải lịch sử...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-2 rounded-xl border bg-white p-5 shadow-sm">
          {history.map((item) => {
            const song = getHistorySong(item)
            const title = song.title || song.name || song.songName || 'Untitled song'
            const artistName = typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown artist'

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
                    <p className="text-sm text-slate-500 truncate">{artistName}</p>
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

          {!history.length && <p className="text-sm text-slate-500">Chưa có lịch sử nghe nào.</p>}
        </div>
      )}
    </div>
  )
}
