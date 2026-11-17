import { useCallback, useEffect, useState } from 'react'

import { playlistsApi, apiUtils } from '@/lib/api'

export default function PlaylistsAdmin() {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await playlistsApi.getPlaylists({ size: 100 })
      setPlaylists(apiUtils.extractList(data))
    } catch (err) {
      setError(err.message || 'Không tải được playlists')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function handleDelete(p) {
    if (!confirm(`Xóa playlist "${p.name || p.title}"?`)) return
    try {
      await playlistsApi.deletePlaylist(p.id || p._id)
      await load()
    } catch (err) {
      setError(err.message || 'Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quản lý Playlists</h1>
      </div>

      <section className="rounded-xl border bg-card p-4 shadow-none">
        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải playlists...</p>
        ) : (
          <div className="space-y-2">
            {playlists.length === 0 && <p className="text-sm text-muted-foreground">Không có playlists.</p>}
            {playlists.map((p) => (
              <div key={p.id || p._id} className="flex items-center justify-between gap-4 border-b py-2">
                <div>
                  <div className="font-medium">{p.name || p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.owner?.username || p.owner?.email || '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(p)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm text-primary">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-sm text-primary mt-2">{error}</p>}
      </section>
    </div>
  )
}
