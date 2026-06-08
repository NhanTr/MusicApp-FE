// src/pages/admin/AdminAlbums.jsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { albumsApi, songsApi } from '@/lib/api'
import { useCatalogData } from '@/hooks/useCatalogData'

function getId(item) { return item?.id || item?._id }

export default function AdminAlbums() {
  const { artists, albums, loading, error, setError, loadData, songsByAlbum } = useCatalogData()

  const [form, setForm]         = useState({ artistId: '', name: '', releaseDate: '', coverUrl: '' })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [query, setQuery]       = useState('')

  const visible = albums.filter(a =>
    String(a?.name || '').toLowerCase().includes(query.trim().toLowerCase())
  )

  async function submitAlbum(e) {
    e.preventDefault()
    if (!form.artistId || !form.name.trim()) return
    setSaving(true); setError('')
    try {
      await albumsApi.createAlbum({
        artistId: form.artistId,
        name: form.name.trim(),
        releaseDate: form.releaseDate || null,
        coverUrl: form.coverUrl?.trim() || null,
      })
      setForm({ artistId: '', name: '', releaseDate: '', coverUrl: '' })
      setShowForm(false)
      await loadData()
    } catch (err) {
      setError(err.message || 'Thêm album thất bại')
    } finally { setSaving(false) }
  }

  async function handleDelete(album) {
    const albumId = getId(album)
    if (!confirm(`Xóa album "${album?.name}"?`)) return
    setDeletingId(albumId); setError('')
    try {
      const albumSongs = songsByAlbum.get(albumId) || []
      for (const song of albumSongs) await songsApi.deleteSong(getId(song))
      await albumsApi.deleteAlbum(albumId)
      await loadData()
    } catch (err) {
      setError(err.message || 'Xóa album thất bại')
    } finally { setDeletingId('') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Albums</h2>
        <button onClick={() => setShowForm(p => !p)}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          <Plus className="h-4 w-4" /> Thêm album
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitAlbum}
          className="grid gap-3 rounded-xl border border-red-200 bg-red-50 p-4 md:grid-cols-4">
          {/* Dropdown chọn artist */}
          <select value={form.artistId} onChange={e => setForm(p => ({ ...p, artistId: e.target.value }))}
            className="rounded-lg border px-3 py-2 text-sm" required>
            <option value="">Chọn nghệ sĩ *</option>
            {artists.map(a => <option key={getId(a)} value={getId(a)}>{a?.name}</option>)}
          </select>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Tên album *" className="rounded-lg border px-3 py-2 text-sm" required />
          <input type="date" value={form.releaseDate} onChange={e => setForm(p => ({ ...p, releaseDate: e.target.value }))}
            className="rounded-lg border px-3 py-2 text-sm" />
          <input value={form.coverUrl} onChange={e => setForm(p => ({ ...p, coverUrl: e.target.value }))}
            placeholder="Cover URL" className="rounded-lg border px-3 py-2 text-sm" />
          <div className="md:col-span-4 flex gap-2">
            <button type="submit" disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
              {saving ? 'Đang thêm...' : 'Lưu album'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border px-4 py-2 text-sm">Hủy</button>
          </div>
        </form>
      )}

      <input value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Tìm album..." className="w-full rounded-lg border px-3 py-2 text-sm" />

      {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : (
        <div className="space-y-2">
          {visible.map(album => {
            const albumId = getId(album)
            return (
              <div key={albumId} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{album?.name}</p>
                  <p className="text-xs text-slate-500">{album?.artist?.name} · {album?.releaseDate}</p>
                </div>
                <button onClick={() => handleDelete(album)} disabled={deletingId === albumId}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60">
                  <Trash2 className="h-3 w-3" />
                  {deletingId === albumId ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            )
          })}
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}