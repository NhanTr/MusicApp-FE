// src/hooks/useCatalogData.js
import { useEffect, useMemo, useState } from 'react'
import { albumsApi, apiUtils, artistsApi, songsApi } from '@/lib/api'

function getId(item) {
  return item?.id || item?._id
}

export function useCatalogData() {
  const [artists, setArtists] = useState([])
  const [albums, setAlbums]   = useState([])
  const [songs, setSongs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [a, al, s] = await Promise.all([
        artistsApi.getArtists({ page: 0, size: 200 }),
        albumsApi.getAlbums({ page: 0, size: 400 }),
        songsApi.getSongs({ page: 0, size: 800 }),
      ])
      setArtists(apiUtils.extractList(a))
      setAlbums(apiUtils.extractList(al))
      setSongs(apiUtils.extractList(s))
    } catch (err) {
      setError(err.message || 'Không tải được dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const albumsByArtist = useMemo(() => {
    const map = new Map()
    albums.forEach((album) => {
      const id = getId(album?.artist)
      if (!id) return
      if (!map.has(id)) map.set(id, [])
      map.get(id).push(album)
    })
    return map
  }, [albums])

  const songsByAlbum = useMemo(() => {
    const map = new Map()
    songs.forEach((song) => {
      const id = getId(song?.album)
      if (!id) return
      if (!map.has(id)) map.set(id, [])
      map.get(id).push(song)
    })
    return map
  }, [songs])

  return { artists, albums, songs, loading, error, setError, loadData, albumsByArtist, songsByAlbum }
}