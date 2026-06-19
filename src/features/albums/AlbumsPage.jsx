import { Link } from 'react-router-dom'
import { DiscAlbum, RefreshCw } from 'lucide-react'

import { albumsApi } from '@/lib/api'
import { usePagedSearch } from '@/features/catalog/usePagedSearch'

export default function AlbumsPage() {
  const catalog = usePagedSearch(
    async ({ query, page, size }) => {
      return albumsApi.getAlbums({ page, size, q: query })
    },
    { initialSize: 5 },
  )

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
          <DiscAlbum className="h-4 w-4" />
          Albums
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Album</h1>
        
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="space-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Tìm kiếm</span>
            <input
              value={catalog.query}
              onChange={(event) => catalog.setQuery(event.target.value)}
              placeholder="Tìm theo tên album hoặc nghệ sĩ"
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

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            {catalog.loading ? 'Đang tải...' : `Hiển thị ${catalog.items.length}/${catalog.totalElements || catalog.items.length} album`}
          </span>
          <button
            type="button"
            onClick={catalog.reload}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Tải lại
          </button>
        </div>

        {catalog.error && <p className="mt-3 text-sm text-red-600">{catalog.error}</p>}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {catalog.items.map((album) => {
            const albumId = album.id || album._id

            return (
              <Link
                key={albumId}
                to={`/music/albums/${albumId}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-200 to-slate-300">
                  {album.coverUrl ? (
                    <img src={album.coverUrl} alt={album.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="space-y-2 p-4">
                  <h2 className="truncate font-semibold text-slate-900">{album.name || 'Untitled album'}</h2>
                  <p className="truncate text-sm text-slate-600">
                    {album.artist?.name || 'Unknown artist'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{album.totalSongs || album.songs?.length || 0} bài hát</span>
                    <span>{album.totalDuration || 0} giây</span>
                  </div>
                  <p className="pt-2 text-xs font-medium text-red-700 opacity-0 transition group-hover:opacity-100">
                    Mở chi tiết album
                  </p>
                </div>
              </Link>
            )
          })}

          {!catalog.loading && !catalog.error && !catalog.items.length && (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 sm:col-span-2 xl:col-span-3">
              Không có album nào phù hợp.
            </p>
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