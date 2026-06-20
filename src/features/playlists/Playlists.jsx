import { useState } from 'react'
import { ChevronDown, ChevronUp, ListMusic, Lock, Music2, Play, Plus, RefreshCw, Trash2, Users } from 'lucide-react'

import { playlistsApi } from '@/lib/api'
import { useMusic } from '@/contexts/MusicContext'
import { usePagedSearch } from '@/features/catalog/usePagedSearch'

function getPlaylistSongs(playlist) {
  if (!playlist) {
    return []
  }

  if (Array.isArray(playlist.songs)) {
    return playlist.songs
  }

  if (Array.isArray(playlist.songList)) {
    return playlist.songList
  }

  if (Array.isArray(playlist.tracks)) {
    return playlist.tracks
  }

  if (Array.isArray(playlist.items)) {
    return playlist.items
  }

  if (Array.isArray(playlist.data?.songs)) {
    return playlist.data.songs
  }

  return []
}

function PlaylistSongList({ songs, loading, error, onPlaySong }) {
  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải bài hát trong playlist...</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  if (!songs.length) {
    return <p className="text-sm text-slate-500">Playlist này chưa có bài hát nào.</p>
  }

  return (
    <div className="space-y-2">
      {songs.map((song, index) => {
        const songId = song.id || song._id || `${song.title || song.name || 'song'}-${index}`

        return (
          <button
            key={songId}
            type="button"
            onClick={() => onPlaySong(song)}
            className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:bg-slate-100"
          >
            <Music2 className="h-4 w-4 shrink-0 text-red-700" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{song.title || song.name || song.songName || 'Untitled song'}</p>
              <p className="truncate text-xs text-slate-500">{song.artist?.name || song.artist || 'Unknown artist'}</p>
            </div>
            <Play className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )
      })}
    </div>
  )
}

function PlaylistCard({
  playlist,
  onDelete,
  canDelete,
  isSelected,
  onSelect,
  selectedPlaylist,
  songsLoading,
  songsError,
  onPlaySong,
}) {
  const songs = getPlaylistSongs(selectedPlaylist || playlist)

  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm transition ${isSelected ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect(playlist)}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900">{playlist.name || playlist.title || 'Untitled playlist'}</h3>
            {playlist.public ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <Users className="w-3 h-3" /> Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                <Lock className="w-3 h-3" /> Private
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-slate-500">{playlist.description || 'Chưa có mô tả'}</p>
          <p className="mt-2 text-xs text-slate-400">{getPlaylistSongs(playlist).length} bài hát</p>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(playlist)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {isSelected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isSelected ? 'Ẩn' : 'Xem'}
          </button>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(playlist.id || playlist._id)}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          )}
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <PlaylistSongList
            songs={songs}
            loading={songsLoading}
            error={songsError}
            onPlaySong={onPlaySong}
          />
        </div>
      )}
    </div>
  )
}

export default function Playlists() {
  const { setCurrentSong } = useMusic()
  const [activeTab, setActiveTab] = useState('mine')
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState('')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [songsLoading, setSongsLoading] = useState(false)
  const [songsError, setSongsError] = useState('')

  const catalog = usePagedSearch(
    async ({ query, page, size }) => {
      if (activeTab === 'public') {
        return playlistsApi.getPublicPlaylists({ page, size, q: query })
      }

      return playlistsApi.getPlaylists({ page, size, q: query })
    },
    { initialSize: 5, dependencies: [activeTab] },
  )

  async function handleSelectPlaylist(playlist) {
    const playlistId = playlist.id || playlist._id

    if (!playlistId) {
      return
    }

    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId('')
      setSelectedPlaylist(null)
      setSongsError('')
      return
    }

    setSelectedPlaylistId(playlistId)
    setSelectedPlaylist(playlist)
    setSongsError('')
    setSongsLoading(true)

    try {
      const detail = await playlistsApi.getPlaylistById(playlistId)
      setSelectedPlaylist(detail || playlist)
    } catch (err) {
      setSongsError(err.message || 'Không tải được bài hát trong playlist.')
    } finally {
      setSongsLoading(false)
    }
  }

  async function handleCreatePlaylist(e) {
    e.preventDefault()
    setActionError('')

    if (!name.trim()) {
      setActionError('Tên playlist không được để trống.')
      return
    }

    setIsCreating(true)
    try {
      await playlistsApi.createPlaylist({ name: name.trim(), isPublic })
      setName('')
      setIsPublic(false)
      setSelectedPlaylistId('')
      setSelectedPlaylist(null)
      catalog.reload()
    } catch (err) {
      setActionError(err.message || 'Không tạo được playlist.')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeletePlaylist(id) {
    if (!id) {
      return
    }

    setActionError('')

    try {
      await playlistsApi.deletePlaylist(id)
      if (selectedPlaylistId === id) {
        setSelectedPlaylistId('')
        setSelectedPlaylist(null)
        setSongsError('')
      }
      catalog.reload()
    } catch (err) {
      setActionError(err.message || 'Không xóa được playlist.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
          <ListMusic className="h-4 w-4" />
          Playlist
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Playlist</h1>
        
      </div>

      <form onSubmit={handleCreatePlaylist} className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-red-700" /> Tạo playlist mới
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên playlist"
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-red-300"
          />
          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Đặt playlist ở chế độ Public
          </label>
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Đang tạo...' : 'Tạo playlist'}
        </button>
      </form>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Tìm kiếm</span>
            <input
              value={catalog.query}
              onChange={(event) => catalog.setQuery(event.target.value)}
              placeholder="Tìm theo tên playlist"
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('mine')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'mine' ? 'bg-red-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}
            >
              Playlist của tôi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('public')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'public' ? 'bg-red-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}
            >
              Public
            </button>
          </div>

          <button
            type="button"
            onClick={catalog.reload}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            {catalog.loading ? 'Đang tải...' : `Hiển thị ${catalog.items.length}/${catalog.totalElements || catalog.items.length} playlist`}
          </span>
          <span>{activeTab === 'mine' ? 'Danh sách của tôi' : 'Danh sách public'}</span>
        </div>

        {actionError && <p className="mt-3 text-sm text-red-600">{actionError}</p>}
        {catalog.error && <p className="mt-3 text-sm text-red-600">{catalog.error}</p>}

        <div className="mt-4 space-y-3">
          {catalog.items.map((playlist) => (
            <PlaylistCard
              key={playlist.id || playlist._id || playlist.name}
              playlist={playlist}
              onDelete={handleDeletePlaylist}
              canDelete={activeTab === 'mine'}
              isSelected={(playlist.id || playlist._id) === selectedPlaylistId}
              onSelect={handleSelectPlaylist}
              selectedPlaylist={(playlist.id || playlist._id) === selectedPlaylistId ? selectedPlaylist : null}
              songsLoading={(playlist.id || playlist._id) === selectedPlaylistId && songsLoading}
              songsError={(playlist.id || playlist._id) === selectedPlaylistId ? songsError : ''}
              onPlaySong={setCurrentSong}
            />
          ))}

          {!catalog.loading && !catalog.error && !catalog.items.length && (
            <p className="text-sm text-slate-500">Chưa có playlist nào.</p>
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
