import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

import { songsApi } from '@/lib/api'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setMessage('Vui lòng chọn file nhạc.')
      return
    }

    setIsUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (title) formData.append('title', title)
      if (artist) formData.append('artist', artist)

      await songsApi.uploadSong(formData)
      setFile(null)
      setTitle('')
      setArtist('')
      setMessage('Tải nhạc thành công.')
    } catch (err) {
      setMessage(err.message || 'Tải nhạc thất bại.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tải Nhạc</h1>
        <p className="text-slate-600 mt-2">Tải lên bài hát của bạn để chia sẻ với mọi người.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tên bài hát</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tên bài hát"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-red-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nghệ sĩ</label>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Tên nghệ sĩ"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-red-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">File nhạc</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600"
          />
        </div>

        {message && <p className="text-sm text-slate-600">{message}</p>}

        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
        >
          <UploadCloud className="w-4 h-4" />
          {isUploading ? 'Đang tải lên...' : 'Tải nhạc'}
        </button>
      </form>
    </div>
  )
}
