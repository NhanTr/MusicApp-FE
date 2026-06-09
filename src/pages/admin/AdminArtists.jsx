// src/pages/admin/AdminArtists.jsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { artistsApi } from '@/lib/api'
import { useCatalogData } from '@/hooks/useCatalogData'

function getId(item) { return item?.id || item?._id }

export default function AdminArtists() {
  const { artists, loading, error, setError, loadData } = useCatalogData()

  const [form, setForm]         = useState({ name: '', bio: '', avatarUrl: '' })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [query, setQuery]       = useState('')

  const visible = artists.filter(a =>
    String(a?.name || '').toLowerCase().includes(query.trim().toLowerCase())
  )

  async function submitArtist(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError('')
    try {
      await artistsApi.createArtist({
        name: form.name.trim(),
        bio: form.bio?.trim() || null,
        avatarUrl: form.avatarUrl?.trim() || null,
      })
      setForm({ name: '', bio: '', avatarUrl: '' })
      setShowForm(false)
      await loadData()
    } catch (err) {
      setError(err.message || 'Thêm nghệ sĩ thất bại')
    } finally {
      setSaving(false)
    }
  }
  async function handleDelete(artist) {
    const artistId = getId(artist)

    if (!confirm(`Xóa nghệ sĩ "${artist?.name}"?`)) return

    setDeletingId(artistId)
    setError('')

    try {
      await artistsApi.deleteArtist(artistId)
      await loadData()
    } catch (err) {
      setError(err.message || 'Xóa nghệ sĩ thất bại')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Nghệ sĩ</h2>
        <button onClick={() => setShowForm(p => !p)}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          <Plus className="h-4 w-4" /> Thêm nghệ sĩ
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitArtist}
          className="grid gap-3 rounded-xl border border-red-200 bg-red-50 p-4 md:grid-cols-3">
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Tên nghệ sĩ *" className="rounded-lg border px-3 py-2 text-sm" required />
          <input value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            placeholder="Tiểu sử" className="rounded-lg border px-3 py-2 text-sm" />
          <input value={form.avatarUrl} onChange={e => setForm(p => ({ ...p, avatarUrl: e.target.value }))}
            placeholder="Avatar URL" className="rounded-lg border px-3 py-2 text-sm" />
          <div className="md:col-span-3 flex gap-2">
            <button type="submit" disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70">
              {saving ? 'Đang thêm...' : 'Lưu nghệ sĩ'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="rounded-lg border px-4 py-2 text-sm">Hủy</button>
          </div>
        </form>
      )}

      <input value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Tìm nghệ sĩ..." className="w-full rounded-lg border px-3 py-2 text-sm" />

      {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : (
        <div className="space-y-2">
          {visible.map(artist => (
       
              <div key={getId(artist)} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800">
                {artist?.name || 'Không tên'}
                <button
                  onClick={() => handleDelete(artist)}
                  disabled={deletingId === getId(artist)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                <Trash2 className="h-3 w-3" />

                      {deletingId === getId(artist)
                        ? 'Đang xóa...'
                        : 'Xóa'}
              </button>
              </div>
          ))}
          
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}