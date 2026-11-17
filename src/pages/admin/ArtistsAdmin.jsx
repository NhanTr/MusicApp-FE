import { useCallback, useEffect, useState } from 'react'
import { Plus, Edit2, Trash } from 'lucide-react'

import { artistsApi, apiUtils } from '@/lib/api'

export default function ArtistsAdmin() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await artistsApi.getArtists({ size: 50 })
      setArtists(apiUtils.extractList(data))
    } catch (err) {
      setError(err.message || 'Không tải được danh sách nghệ sĩ')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setError('')
    try {
      if (editing) {
        await artistsApi.updateArtist(editing.id || editing._id, { name: name.trim() })
        setEditing(null)
      } else {
        await artistsApi.createArtist({ name: name.trim() })
      }

      setName('')
      await load()
    } catch (err) {
      setError(err.message || 'Lưu nghệ sĩ thất bại')
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit(a) {
    setEditing(a)
    setName(a.name || '')
  }

  async function handleDelete(a) {
    if (!confirm(`Xóa nghệ sĩ "${a.name}"?`)) return
    try {
      await artistsApi.deleteArtist(a.id || a._id)
      await load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Nghệ sĩ</h1>
      </div>

      <section className="rounded-xl border bg-card p-4 shadow-none mb-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 rounded-lg border border-border px-3 py-2 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên nghệ sĩ"
            required
          />
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white" disabled={saving}>
            <Plus className="w-4 h-4" />
            {editing ? 'Cập nhật' : 'Tạo'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setName('') }} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2">
              Hủy
            </button>
          )}
        </form>
        {error && <p className="text-sm text-primary mt-2">{error}</p>}
      </section>

      <section className="rounded-xl border bg-card p-4 shadow-none">
        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải danh sách nghệ sĩ...</p>
        ) : (
          <div className="space-y-2">
            {artists.length === 0 && <p className="text-sm text-muted-foreground">Không có nghệ sĩ.</p>}
            {artists.map((a) => (
              <div key={a.id || a._id} className="flex items-center justify-between gap-4 border-b py-2">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.id || a._id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(a)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm">
                    <Edit2 className="w-4 h-4" />
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(a)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm text-primary">
                    <Trash className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
