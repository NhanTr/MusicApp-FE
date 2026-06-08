import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Album, ArrowLeft, Music2, Play, RefreshCw, Users } from 'lucide-react'

import LikeButton from '@/components/LikeButton'
import { useMusic } from '@/contexts/MusicContext'
import { albumsApi, apiUtils, artistsApi, favoritesApi } from '@/lib/api'
import { usePagedSearch } from '@/features/catalog/usePagedSearch'
import { resolveSongListenerCount } from '@/lib/song-utils'

function ArtistBanner({ artist }) {
  const initial = (artist?.name || 'A').trim().charAt(0).toUpperCase()

  return (
    <section className="overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-red-700 via-red-700 to-slate-950 text-white shadow-xl">
      <div className="grid gap-6 p-6 md:grid-cols-[240px_1fr] md:p-8">
        <div className="flex items-center justify-center">
          <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-[32px] bg-white/10 ring-1 ring-white/15">
            {artist?.avatarUrl ? (
              <img src={artist.avatarUrl} alt={artist?.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-6xl font-bold text-white">{initial}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-50">
              <Users className="h-4 w-4" />
              Artist Profile
            </div>
            <div>
              <h1 className="text-3xl font-bold md:text-5xl">{artist?.name || 'Nghệ sĩ'}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-red-50/90 md:text-base">
                {artist?.bio || 'Chưa có mô tả cho nghệ sĩ này.'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-red-50/80">Bài hát</p>
              <p className="mt-2 text-2xl font-semibold">{artist?.songCount || 0}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-red-50/80">Người theo dõi</p>
              <p className="mt-2 text-2xl font-semibold">{artist?.followerCount || 0}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-red-50/80">Trạng thái</p>
              <p className="mt-2 text-2xl font-semibold">{artist?.isFollowing ? 'Đang theo dõi' : 'Khám phá'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ArtistDetailPage() {
  const { artistId } = useParams()
  const { setCurrentSong } = useMusic()
  const [artist, setArtist] = useState(null)
  const [loadingArtist, setLoadingArtist] = useState(true)
  const [artistError, setArtistError] = useState('')
  const [likedSongs, setLikedSongs] = useState(new Set())

  const albumsCatalog = usePagedSearch(
    async ({ query, page, size }) => albumsApi.getAlbums({ artistId, page, size, q: query }),
    { initialSize: 12, dependencies: [artistId] },
  )

  const songsCatalog = usePagedSearch(
    async ({ page, size }) => artistsApi.getArtistSongs(artistId, { page, size }),
    { initialSize: 12, dependencies: [artistId] },
  )

  useEffect(() => {
    let isMounted = true

    async function loadArtist() {
      setLoadingArtist(true)
      setArtistError('')

      try {
        const data = await artistsApi.getArtistById(artistId)
        if (isMounted) {
          setArtist(data)
        }
      } catch (error) {
        if (isMounted) {
          setArtistError(error.message || 'Không tải được thông tin nghệ sĩ.')
        }
      } finally {
        if (isMounted) {
          setLoadingArtist(false)
        }
      }
    }

    if (artistId) {
      loadArtist()
    }

    return () => {
      isMounted = false
    }
  }, [artistId])

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

  const breadcrumb = useMemo(() => artist?.name || 'Nghệ sĩ', [artist?.name])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/music/artists" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-700">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách nghệ sĩ
        </Link>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{breadcrumb}</div>
      </div>

      {loadingArtist ? (
        <div className="rounded-[28px] border bg-white p-6 shadow-sm">Đang tải thông tin nghệ sĩ...</div>
      ) : artistError ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">{artistError}</div>
      ) : (
        <ArtistBanner artist={artist} />
      )}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                <Album className="h-4 w-4" />
                Albums
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">Album của nghệ sĩ</h2>
              <p className="mt-1 text-sm text-slate-500">Tìm và tải thêm album theo nghệ sĩ từ dữ liệu DB.</p>
            </div>
            <button
              type="button"
              onClick={albumsCatalog.reload}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <label className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Tìm album</span>
              <input
                value={albumsCatalog.query}
                onChange={(event) => albumsCatalog.setQuery(event.target.value)}
                placeholder="Tìm theo tên album"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Số lượng</span>
              <input
                type="number"
                min="1"
                step="1"
                value={albumsCatalog.pageSize}
                onChange={(event) => albumsCatalog.setPageSize(Math.max(1, Number(event.target.value) || 1))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>{albumsCatalog.loading ? 'Đang tải...' : `Hiển thị ${albumsCatalog.items.length}/${albumsCatalog.totalElements || albumsCatalog.items.length} album`}</span>
          </div>

          {albumsCatalog.error && <p className="mt-3 text-sm text-red-600">{albumsCatalog.error}</p>}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {albumsCatalog.items.map((album) => {
              const albumId = album.id || album._id
              return (
                <Link
                  key={albumId}
                  to={`/music/albums/${albumId}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-slate-200 to-slate-300">
                    {album.coverUrl ? <img src={album.coverUrl} alt={album.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="truncate font-semibold text-slate-900">{album.name || 'Untitled album'}</h3>
                    <p className="truncate text-sm text-slate-600">{album.totalSongs || album.songs?.length || 0} bài hát</p>
                    <p className="text-xs font-medium text-red-700 opacity-0 transition group-hover:opacity-100">Mở chi tiết album</p>
                  </div>
                </Link>
              )
            })}

            {!albumsCatalog.loading && !albumsCatalog.error && !albumsCatalog.items.length && (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 sm:col-span-2">Không có album nào.</p>
            )}
          </div>

          {albumsCatalog.hasMore && !albumsCatalog.loading && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={albumsCatalog.loadMore}
                disabled={albumsCatalog.loadingMore}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {albumsCatalog.loadingMore ? 'Đang tải thêm...' : 'Tải thêm'}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                <Music2 className="h-4 w-4" />
                Songs
              </div>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">Bài hát của nghệ sĩ</h2>
              <p className="mt-1 text-sm text-slate-500">Chọn để phát ngay trong player.</p>
            </div>
            <button
              type="button"
              onClick={songsCatalog.reload}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Danh sách bài hát theo nghệ sĩ, tải dần theo lô.
            </div>
            <label className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Số lượng</span>
              <input
                type="number"
                min="1"
                step="1"
                value={songsCatalog.pageSize}
                onChange={(event) => songsCatalog.setPageSize(Math.max(1, Number(event.target.value) || 1))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-red-300 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>{songsCatalog.loading ? 'Đang tải...' : `Hiển thị ${songsCatalog.items.length}/${songsCatalog.totalElements || songsCatalog.items.length} bài hát`}</span>
          </div>

          {songsCatalog.error && <p className="mt-3 text-sm text-red-600">{songsCatalog.error}</p>}

          <div className="mt-4 space-y-2">
            {songsCatalog.items.map((song) => {
              const songId = song.id || song._id
              return (
                <div key={songId} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100">
                  <button type="button" onClick={() => setCurrentSong(song)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <Music2 className="h-4 w-4 shrink-0 text-red-700" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{song.title || song.name || song.songName || 'Untitled song'}</p>
                      <p className="truncate text-sm text-slate-500">{song.album?.name || 'Bài hát của nghệ sĩ'}</p>
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

            {!songsCatalog.loading && !songsCatalog.error && !songsCatalog.items.length && (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">Chưa có bài hát nào.</p>
            )}
          </div>

          {songsCatalog.hasMore && !songsCatalog.loading && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={songsCatalog.loadMore}
                disabled={songsCatalog.loadingMore}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {songsCatalog.loadingMore ? 'Đang tải thêm...' : 'Tải thêm'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}