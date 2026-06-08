import { useState } from 'react'
import { ListMusic, Lock, Plus, RefreshCw, Trash2, Users } from 'lucide-react'

import { playlistsApi } from '@/lib/api'
import { usePagedSearch } from '@/features/catalog/usePagedSearch'

function PlaylistCard({ playlist, onDelete, canDelete }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 truncate">{playlist.name || playlist.title || 'Untitled playlist'}</h3>
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
        <p className="text-sm text-slate-500 mt-1 truncate">{playlist.description || 'Chưa có mô tả'}</p>
        <p className="text-xs text-slate-400 mt-2">{playlist.songs?.length || 0} bài hát</p>
      </div>

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
  )
}

export default function Playlists() {
  const [activeTab, setActiveTab] = useState('mine')
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState('')

  const catalog = usePagedSearch(
    async ({ query, page, size }) => {
      if (activeTab === 'public') {
        return playlistsApi.getPublicPlaylists({ page, size, q: query })
      }

      return playlistsApi.getPlaylists({ page, size, q: query })
    },
    { initialSize: 5, dependencies: [activeTab] },
  )

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
        <p className="text-slate-600">Tìm playlist theo tên ngay khi gõ, chọn số lượng và tải thêm theo lô.</p>
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
