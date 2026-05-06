import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Album, Heart, ListMusic, Music2, Play, UserRound } from 'lucide-react'

import { useMusic } from '@/contexts/MusicContext'
import { apiUtils, searchApi } from '@/lib/api'

function normalizeSearchResults(data) {
  if (!data) {
    return { songs: [], artists: [], albums: [], playlists: [] }
  }

  const payload = data?.data || data

  return {
    songs: apiUtils.extractList(payload?.songs),
    artists: apiUtils.extractList(payload?.artists),
    albums: apiUtils.extractList(payload?.albums),
    playlists: apiUtils.extractList(payload?.playlists),
  }
}

function SongRow({ song, onPlay }) {
  const title = song.title || song.name || song.songName || 'Untitled song'
  const artistName = typeof song.artist === 'string' ? song.artist : song.artist?.name || 'Unknown artist'

  return (
    <button
      type="button"
      onClick={() => onPlay(song)}
      className="w-full flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:bg-slate-100 transition"
    >
      <Music2 className="w-4 h-4 text-red-700 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900 truncate">{title}</p>
        <p className="text-sm text-slate-500 truncate">{artistName}</p>
      </div>
      <Play className="w-4 h-4 text-slate-400 shrink-0" />
    </button>
  )
}

export default function SearchPage() {
  const { setCurrentSong } = useMusic()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const [results, setResults] = useState({ songs: [], artists: [], albums: [], playlists: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        const data = await searchApi.search(query)
        if (!isMounted) return
        setResults(normalizeSearchResults(data))
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Không tìm thấy kết quả phù hợp.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadResults()

    return () => {
      isMounted = false
    }
  }, [query])

  const hasResults = useMemo(
    () => results.songs.length || results.artists.length || results.albums.length || results.playlists.length,
    [results],
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tìm Kiếm Tổng Hợp</h1>
        <p className="text-slate-600 mt-2">
          {query ? `Kết quả cho “${query}”` : 'Nhập từ khóa ở thanh tìm kiếm phía trên.'}
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
            <div className="mb-4 flex items-center gap-2">
              <Music2 className="w-5 h-5 text-red-700" />
              <h2 className="text-lg font-semibold text-slate-900">Bài hát</h2>
            </div>
            <div className="space-y-2">
              {results.songs.map((song) => (
                <SongRow key={song.id || song._id || song.title} song={song} onPlay={setCurrentSong} />
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
                <div key={artist.id || artist._id || artist.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-900 truncate">{artist.name || artist.fullName || 'Unknown artist'}</p>
                  <p className="text-sm text-slate-500 truncate">{artist.bio || artist.description || 'Nghệ sĩ'}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Album className="w-5 h-5 text-red-700" />
              <h2 className="text-lg font-semibold text-slate-900">Album</h2>
            </div>
            <div className="space-y-2">
              {results.albums.map((album) => (
                <div key={album.id || album._id || album.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-900 truncate">{album.name || album.title || 'Untitled album'}</p>
                  <p className="text-sm text-slate-500 truncate">{album.description || album.artist?.name || 'Album'}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-red-700" />
              <h2 className="text-lg font-semibold text-slate-900">Playlist</h2>
            </div>
            <div className="space-y-2">
              {results.playlists.map((playlist) => (
                <div key={playlist.id || playlist._id || playlist.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-900 truncate">{playlist.name || playlist.title || 'Untitled playlist'}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {playlist.description || `${playlist.songs?.length || 0} bài hát`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {!query && (
        <div className="mt-6 text-sm text-slate-500">
          Quay lại <Link to="/music" className="text-red-700 font-medium hover:underline">Nhạc Xu Hướng</Link> để xem bài hát đang thịnh hành.
        </div>
      )}
    </div>
  )
}
