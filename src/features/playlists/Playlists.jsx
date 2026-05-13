import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Users, Lock } from 'lucide-react'

import { playlistsApi, apiUtils } from '@/lib/api'

function PlaylistCard({ playlist, onDelete }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 truncate">{playlist.name || playlist.title || 'Untitled playlist'}</h3>
          {playlist.isPublic ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              <Users className="w-3 h-3" /> Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              <Lock className="w-3 h-3" /> Private
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1 truncate">{playlist.description || 'Chưa có mô tả'}</p>
        <p className="text-xs text-slate-400 mt-2">{playlist.songs?.length || 0} bài hát</p>
      </div>

      <button
        type="button"
        onClick={() => onDelete(playlist.id || playlist._id)}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        Xóa
      </button>
    </div>
  )
}

export default function Playlists() {
  const [myPlaylists, setMyPlaylists] = useState([])
  const [publicPlaylists, setPublicPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('mine')
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  async function loadPlaylists() {
    setLoading(true)
    setError('')

    try {
      const [mineData, publicData] = await Promise.all([
        playlistsApi.getPlaylists(),
        playlistsApi.getPublicPlaylists(),
      ])

      setMyPlaylists(apiUtils.extractList(mineData))
      setPublicPlaylists(apiUtils.extractList(publicData))
    } catch (err) {
      setError(err.message || 'Không tải được danh sách playlist.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlaylists()
  }, [])

  const visiblePlaylists = useMemo(() => (activeTab === 'mine' ? myPlaylists : publicPlaylists), [activeTab, myPlaylists, publicPlaylists])

  async function handleCreatePlaylist(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Tên playlist không được để trống.')
      return
    }

    setIsCreating(true)
    try {
      await playlistsApi.createPlaylist({ name: name.trim(), isPublic })
      setName('')
      setIsPublic(false)
      await loadPlaylists()
    } catch (err) {
      setError(err.message || 'Không tạo được playlist.')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeletePlaylist(id) {
    if (!id) return

    try {
      await playlistsApi.deletePlaylist(id)
      await loadPlaylists()
    } catch (err) {
      setError(err.message || 'Không xóa được playlist.')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Playlist</h1>
        <p className="text-slate-600 mt-2">Quản lý playlist cá nhân và public.</p>
      </div>

      <form onSubmit={handleCreatePlaylist} className="rounded-xl border bg-white p-5 shadow-sm mb-6">
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

      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('mine')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'mine' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          Playlist của tôi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('public')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'public' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          Public
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Đang tải playlist...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {visiblePlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id || playlist._id || playlist.name} playlist={playlist} onDelete={handleDeletePlaylist} />
          ))}

          {!visiblePlaylists.length && <p className="text-sm text-slate-500">Chưa có playlist nào.</p>}
        </div>
      )}
    </div>
  )
}
