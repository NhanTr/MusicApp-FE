import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { apiUtils, songsApi } from '@/lib/api'

const MusicContext = createContext(null)

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [songsLoading, setSongsLoading] = useState(true)
  const [songsError, setSongsError] = useState('')

  const loadSongs = useCallback(async () => {
    setSongsLoading(true)
    setSongsError('')

    try {
      const data = await songsApi.getTrendingSongs()
      const items = apiUtils.extractList(data)

      setSongs(items)
      setCurrentSong((prev) => prev || items[0] || null)
    } catch (err) {
      setSongs([])
      setSongsError(err.message || 'Không tải được danh sách bài hát.')
    } finally {
      setSongsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSongs()
  }, [loadSongs])

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        setCurrentSong,
        songsLoading,
        songsError,
        reloadSongs: loadSongs,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)

  if (!ctx) {
    throw new Error('useMusic must be used within MusicProvider')
  }

  return ctx
}

export default MusicContext
