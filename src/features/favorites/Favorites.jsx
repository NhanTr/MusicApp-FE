import React from 'react'

export default function Favorites() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Album</h1>
        <p className="text-slate-600 mt-2">Danh sách album yêu thích của bạn.</p>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Chưa có album yêu thích.</p>
      </div>
    </div>
  )
}
