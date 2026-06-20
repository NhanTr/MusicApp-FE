import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, DiscAlbum, Music2, Play, RefreshCw, UserRound } from 'lucide-react'

import LikeButton from '@/components/LikeButton'
import { useMusic } from '@/contexts/MusicContext'
import { albumsApi, apiUtils, favoritesApi } from '@/lib/api'
import { usePagedSearch } from '@/features/catalog/usePagedSearch'
import { resolveSongListenerCount } from '@/lib/song-utils'

function formatReleaseDate(value) {
  if (!value) return 'Chưa phát hành'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date)
}

export default function AlbumDetailPage() {
  const { albumId } = useParams()
  const { setCurrentSong } = useMusic()
  const [album, setAlbum] = useState(null)
  const [loadingAlbum, setLoadingAlbum] = useState(true)
  const [albumError, setAlbumError] = useState('')
  const [likedSongs, setLikedSongs] = useState(new Set())

  const relatedAlbumsCatalog = usePagedSearch(
    async ({ query, page, size }) => {
      const artistId = album?.artist?.id
      if (!artistId) return { content: [], totalElements: 0, totalPages: 0, page: 0, size }
      return albumsApi.getAlbums({ artistId, page, size, q: query })
    },
    { initialSize: 8, dependencies: [album?.artist?.id] },
  )

  useEffect(() => {
    let isMounted = true

    async function loadAlbum() {
      setLoadingAlbum(true)
      setAlbumError('')

      try {
        const data = await albumsApi.getAlbumById(albumId)
        if (isMounted) {
          setAlbum(data)
        }
      } catch (error) {
        if (isMounted) {
          setAlbumError(error.message || 'Không tải được thông tin album.')
        }
      } finally {
        if (isMounted) {
          setLoadingAlbum(false)
        }
      }
    }

    if (albumId) {
      loadAlbum()
    }

    return () => {
      isMounted = false
    }
  }, [albumId])

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await favoritesApi.getFavorites({ size: 1000 })
        const favoriteIds = new Set(apiUtils.extractList(favorites).map((song) => song.id || song._id))
        setLikedSongs(favoriteIds)
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }

    loadFavorites()
  }, [])

  const songs = useMemo(() => album?.songs || [], [album?.songs])
  const coverInitial = (album?.name || 'A').trim().charAt(0).toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/music/albums" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-700">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách album
        </Link>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{album?.name || 'Album detail'}</div>
      </div>

      {loadingAlbum ? (
        <div className="rounded-[28px] border bg-white p-6 shadow-sm">Đang tải thông tin album...</div>
      ) : albumError ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">{albumError}</div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[380px_1fr]">
            <div className="relative min-h-[320px] bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">
              {album?.coverUrl ? (
                <img src={album.coverUrl} alt={album?.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-7xl font-bold text-slate-700">{coverInitial}</div>
              )}
            </div>

            <div className="p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                <DiscAlbum className="h-4 w-4" />
                Album Profile
              </div>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-5xl">{album?.name || 'Untitled album'}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {album?.artist?.id ? (
                  <Link to={`/music/artists/${album.artist.id}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 transition hover:border-red-200 hover:text-red-700">
                    <UserRound className="h-4 w-4" />
                    {album?.artist?.name || 'Unknown artist'}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-slate-600">
                    <UserRound className="h-4 w-4" />
                    {album?.artist?.name || 'Unknown artist'}
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-3 py-1.5">{formatReleaseDate(album?.releaseDate)}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5">{songs.length} bài hát</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5">{album?.totalDuration || 0} giây</span>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
                {album?.artist?.name
                  ? `Album này thuộc nghệ sĩ ${album.artist.name}. Giao diện được thiết kế như một trang album thực tế, với cover lớn, thống kê nhanh và danh sách bài hát để phát ngay.`
                  : 'Album chi tiết và danh sách bài hát của album.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                  onClick={() => songs[0] && setCurrentSong(songs[0])}
                >
                  <Play className="h-4 w-4" />
                  Phát bài đầu
                </button>
                <button
                  type="button"
                  onClick={relatedAlbumsCatalog.reload}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tải album liên quan
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                <Music2 className="h-4 w-4" />
                Songs
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">Bài hát trong album</h2>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{songs.length} tracks</div>
          </div>

          <div className="space-y-2">
            {songs.map((song) => {
              const songId = song.id || song._id
              return (
                <div key={songId} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100">
                  <button type="button" onClick={() => setCurrentSong(song)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Music2 className="h-4 w-4 shrink-0 text-red-700" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{song.title || song.name || song.songName || 'Untitled song'}</p>
                      <p className="truncate text-sm text-slate-500">{song.artist?.name || album?.artist?.name || 'Unknown artist'}</p>
                      <p className="truncate text-xs text-slate-400">{resolveSongListenerCount(song)} lượt nghe</p>
                    </div>
                  </button>

                  <Play className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <LikeButton
                      songId={songId}
                      initialLiked={likedSongs.has(songId)}
                      onLikeChange={(isLiked) => {
                        const nextLikedSongs = new Set(likedSongs)
                        if (isLiked) {
                          nextLikedSongs.add(songId)
                        } else {
                          nextLikedSongs.delete(songId)
                        }
                        setLikedSongs(nextLikedSongs)
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {!songs.length && (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Album này chưa có bài hát nào.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                <DiscAlbum className="h-4 w-4" />
                Related
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">Album cùng nghệ sĩ</h2>
            </div>
          </div>

          {album?.artist?.id ? (
            <>
              <div className="grid gap-3 md:grid-cols-[1fr_180px]">
                <label className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Tìm album</span>
                  <input
                    value={relatedAlbumsCatalog.query}
                    onChange={(event) => relatedAlbumsCatalog.setQuery(event.target.value)}
                    placeholder="Tìm album cùng nghệ sĩ"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Số lượng</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={relatedAlbumsCatalog.pageSize}
                    onChange={(event) => relatedAlbumsCatalog.setPageSize(Math.max(1, Number(event.target.value) || 1))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
                <span>{relatedAlbumsCatalog.loading ? 'Đang tải...' : `Hiển thị ${relatedAlbumsCatalog.items.length}/${relatedAlbumsCatalog.totalElements || relatedAlbumsCatalog.items.length} album`}</span>
                <button
                  type="button"
                  onClick={relatedAlbumsCatalog.reload}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tải lại
                </button>
              </div>

              {relatedAlbumsCatalog.error && <p className="mt-3 text-sm text-red-600">{relatedAlbumsCatalog.error}</p>}

              <div className="mt-4 space-y-2">
                {relatedAlbumsCatalog.items
                  .filter((relatedAlbum) => (relatedAlbum.id || relatedAlbum._id) !== albumId)
                  .map((relatedAlbum) => {
                    const relatedAlbumId = relatedAlbum.id || relatedAlbum._id
                    return (
                      <Link
                        key={relatedAlbumId}
                        to={`/music/albums/${relatedAlbumId}`}
                        className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100"
                      >
                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-200">
                          {relatedAlbum.coverUrl ? <img src={relatedAlbum.coverUrl} alt={relatedAlbum.name} className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-900">{relatedAlbum.name || 'Untitled album'}</p>
                          <p className="truncate text-sm text-slate-500">{relatedAlbum.totalSongs || relatedAlbum.songs?.length || 0} bài hát</p>
                        </div>
                      </Link>
                    )
                  })}

                {!relatedAlbumsCatalog.loading && !relatedAlbumsCatalog.error && !relatedAlbumsCatalog.items.filter((relatedAlbum) => (relatedAlbum.id || relatedAlbum._id) !== albumId).length && (
                  <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">Không có album liên quan.</p>
                )}
              </div>

              {relatedAlbumsCatalog.hasMore && !relatedAlbumsCatalog.loading && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={relatedAlbumsCatalog.loadMore}
                    disabled={relatedAlbumsCatalog.loadingMore}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {relatedAlbumsCatalog.loadingMore ? 'Đang tải thêm...' : 'Tải thêm'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">Album này chưa có nghệ sĩ liên kết.</p>
          )}
        </div>
      </section>
    </div>
  )
}