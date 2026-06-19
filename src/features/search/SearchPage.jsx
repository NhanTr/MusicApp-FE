import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Album, ListMusic, Music2, Play, UserRound } from 'lucide-react'

import { useMusic } from '@/contexts/MusicContext'
import { apiUtils, searchApi, favoritesApi } from '@/lib/api'
import LikeButton from '@/components/LikeButton'
import { resolveSongListenerCount } from '@/lib/song-utils'

const SONG_SORT_OPTIONS = [
  { value: 'listeners-desc', label: 'Nghe nhiều nhất' },
  { value: 'listeners-asc', label: 'Nghe ít nhất' },
  { value: 'title-asc', label: 'Tên A-Z' },
  { value: 'title-desc', label: 'Tên Z-A' },
]

function normalizeSearchResults(data) {
  if (!data) return { songs: [], artists: [], albums: [], playlists: [] }
  const payload = data?.data || data
  return {
    songs: Array.isArray(payload?.songs) ? payload.songs : apiUtils.extractList(payload?.songs),
    artists: Array.isArray(payload?.artists) ? payload.artists : apiUtils.extractList(payload?.artists),
    albums: Array.isArray(payload?.albums) ? payload.albums : apiUtils.extractList(payload?.albums),
    playlists: Array.isArray(payload?.playlists) ? payload.playlists : apiUtils.extractList(payload?.playlists),
  }
}

export default function SearchPage() {
  const { setCurrentSong } = useMusic()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''

  const [results, setResults] = useState({ songs: [], artists: [], albums: [], playlists: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [likedSongs, setLikedSongs] = useState(new Set())
  const [songSort, setSongSort] = useState('listeners-desc')

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await favoritesApi.getFavorites({ size: 1000 })
        const items = apiUtils.extractList(favorites)
        const favoriteIds = new Set(items.map((s) => s.songId || s.song?.id || s.id || s._id))
        setLikedSongs(favoriteIds)
      } catch (err) {
        console.error('Error loading favorites:', err)
      }
    }
    loadFavorites()
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadResults() {
      if (!query) {
        setResults({ songs: [], artists: [], albums: [], playlists: [] })
        setLoading(false)
        setError('')
        return
      }

      setLoading(true)
      setError('')

      try {
        // Gửi query GỐC có dấu lên BE để BE tự tìm
        const data = await searchApi.search(query, { page: 0, size: 20 })
        if (!isMounted) return
        setResults(normalizeSearchResults(data))
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Không tìm thấy kết quả phù hợp.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    const timer = setTimeout(loadResults, 400)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [query])

  const hasResults = useMemo(
    () => results.songs.length || results.artists.length || results.albums.length || results.playlists.length,
    [results],
  )

  const sortedSongs = useMemo(() => {
    return [...results.songs].sort((a, b) => {
      const aTitle = (a.title || a.name || '').toLowerCase()
      const bTitle = (b.title || b.name || '').toLowerCase()
      const aCount = resolveSongListenerCount(a)
      const bCount = resolveSongListenerCount(b)
      switch (songSort) {
        case 'listeners-asc': return aCount - bCount
        case 'title-asc': return aTitle.localeCompare(bTitle)
        case 'title-desc': return bTitle.localeCompare(aTitle)
        default: return bCount - aCount
      }
    })
  }, [results.songs, songSort])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tìm Kiếm Tổng Hợp</h1>
        <p className="text-slate-600 mt-2">
          {query ? `Kết quả cho "${query}"` : 'Nhập từ khóa ở thanh tìm kiếm phía trên.'}
        </p>
      </div>

      {!query && (
        <div className="rounded-xl border bg-white p-5 shadow-sm text-sm text-slate-500">
          Tìm theo bài hát, nghệ sĩ, album hoặc playlist.
        </div>
      )}

      {loading && <p className="text-sm text-slate-500">Đang tải kết quả...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!!query && !loading && !error && !hasResults && (
        <div className="rounded-xl border bg-white p-5 shadow-sm text-sm text-slate-500">
          Không có kết quả nào phù hợp.
        </div>
      )}

      {!!hasResults && (
        <div className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Music2 className="w-5 h-5 text-red-700" />
                <h2 className="text-lg font-semibold text-slate-900">Bài hát</h2>
              </div>
              <select
                value={songSort}
                onChange={(e) => setSongSort(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              >
                {SONG_SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              {sortedSongs.map((song) => (
                <div key={song.id || song._id || song.title} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition group">
                  <Music2 className="w-4 h-4 text-red-700 shrink-0" />
                  <button type="button" onClick={() => setCurrentSong(song)} className="min-w-0 flex-1 text-left">
                    <p className="font-medium text-slate-900 truncate">{song.title || song.name || 'Untitled song'}</p>
                    <p className="text-sm text-slate-500 truncate">{typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown artist'}</p>
                    <p className="text-xs text-slate-400 truncate">{resolveSongListenerCount(song)} lượt nghe</p>
                  </button>
                  <Play className="w-4 h-4 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <LikeButton
                      songId={song.id || song._id}
                      initialLiked={likedSongs.has(song.id || song._id)}
                      onLikeChange={(liked) => {
                        const next = new Set(likedSongs)
                        if (liked) next.add(song.id || song._id)
                        else next.delete(song.id || song._id)
                        setLikedSongs(next)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-red-700" />
              <h2 className="text-lg font-semibold text-slate-900">Nghệ sĩ</h2>
            </div>
            <div className="space-y-2">
              {results.artists.map((artist) => (
                <Link key={artist.id || artist.name} to={`/music/artists/${artist.id}`}
                  className="block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-red-200 hover:bg-red-50">
                  <p className="font-medium text-slate-900 truncate">{artist.name || 'Unknown artist'}</p>
                  <p className="text-sm text-slate-500 truncate">Nghệ sĩ</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {!query && (
        <div className="mt-6 text-sm text-slate-500">
          Quay lại <Link to="/music/trending" className="text-red-700 font-medium hover:underline">Nhạc Xu Hướng</Link> để xem bài hát đang thịnh hành.
        </div>
      )}
    </div>
  )
}