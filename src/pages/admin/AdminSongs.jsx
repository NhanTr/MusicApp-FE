// src/pages/admin/AdminSongs.jsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { songsApi } from '@/lib/api'
import { useCatalogData } from '@/hooks/useCatalogData'

function getId(item) { return item?.id || item?._id }

export default function AdminSongs() {
  const { artists, albums, songs, loading, error, setError, loadData } = useCatalogData()

  const [form, setForm] = useState({
    artistId: '', albumId: '', title: '', duration: 180, fileSound: null, fileImage: null,
  })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [query, setQuery]       = useState('')

  // Lọc albums theo artist đã chọn trong form
  const filteredAlbums = albums.filter(a => getId(a?.artist) === form.artistId)

  const visible = songs.filter(s =>
    String(s?.title || '').toLowerCase().includes(query.trim().toLowerCase())
  )

  async function submitSong(e) {
    e.preventDefault()
    if (!form.artistId || !form.title.trim() || !form.fileSound) return
    setSaving(true); setError('')
    try {
      const fd = new FormData()
      fd.append('fileSound', form.fileSound)
      if (form.fileImage) fd.append('fileImage', form.fileImage)
      fd.append('title', form.title.trim())
      fd.append('duration', String(Number(form.duration) || 180))
      fd.append('artistId', form.artistId)
      if (form.albumId) fd.append('albumId', form.albumId)
      await songsApi.uploadSong(fd)
      setForm({ artistId: '', albumId: '', title: '', duration: 180, fileSound: null, fileImage: null })
      setShowForm(false)
      await loadData()
    } catch (err) {
      setError(err.message || 'Thêm bài hát thất bại')
    } finally { setSaving(false) }
  }

  async function handleDelete(song) {
    const songId = getId(song)
    if (!confirm(`Xóa bài hát "${song?.title}"?`)) return
    setDeletingId(songId); setError('')
    try {
      await songsApi.deleteSong(songId)
      await loadData()
    } catch (err) {
      setError(err.message || 'Xóa bài hát thất bại')
    } finally { setDeletingId('') }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Bài hát</h2>
        <button onClick={() => setShowForm(p => !p)}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          <Plus className="h-4 w-4" /> Thêm bài hát
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitSong}
          className="grid gap-3 rounded-xl border border-red-200 bg-red-50 p-4 md:grid-cols-3">
          {/* Chọn artist → lọc album */}
          <select value={form.artistId}
            onChange={e => setForm(p => ({ ...p, artistId: e.target.value, albumId: '' }))}
            className="rounded-lg border px-3 py-2 text-sm" required>
            <option value="">Chọn nghệ sĩ *</option>
            {artists.map(a => <option key={getId(a)} value={getId(a)}>{a?.name}</option>)}
          </select>
          <select value={form.albumId} onChange={e => setForm(p => ({ ...p, albumId: e.target.value }))}
            className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Chọn album (tùy chọn)</option>
            {filteredAlbums.map(a => <option key={getId(a)} value={getId(a)}>{a?.name}</option>)}
          </select>
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Tên bài hát *" className="rounded-lg border px-3 py-2 text-sm" required />
          <div className=""> 
            <p className="text-xs text-slate-500">File âm thanh *</p>
            <input type="file" accept="audio/*" 
            onChange={e => setForm(p => ({ ...p, fileSound: e.target.files?.[0] || null }))}
            className="rounded-lg border px-3 py-2 text-sm" required />
          </div>
          <div > 
            <p className="text-xs text-slate-500">File ảnh (tùy chọn)</p>

          <input type="file" accept="image/*" 
            onChange={e => setForm(p => ({ ...p, fileImage: e.target.files?.[0] || null }))}
            className="rounded-lg border px-3 py-2 text-sm" />
            </div>
          <div className="md:col-span-3 flex gap-2">
            <button type="submit" disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
              {saving ? 'Đang thêm...' : 'Lưu bài hát'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border px-4 py-2 text-sm">Hủy</button>
          </div>
        </form>
      )}

      <input value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Tìm bài hát..." className="w-full rounded-lg border px-3 py-2 text-sm" />

      {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : (
        <div className="space-y-2">
          {visible.map(song => {
            const songId = getId(song)
            return (
              <div key={songId} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{song?.title}</p>
                  <p className="text-xs text-slate-500">{song?.artist?.name} · {song?.album?.name}</p>
                </div>
                <button onClick={() => handleDelete(song)} disabled={deletingId === songId}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60">
                  <Trash2 className="h-3 w-3" />
                  {deletingId === songId ? 'Đang xóa...' : 'Xóa'}
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