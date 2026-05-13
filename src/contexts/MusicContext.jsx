import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { apiUtils, songsApi, historyApi } from '@/lib/api'

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
      // Test data with sample URL
      const testSongs = [
        {
          id: 1,
          title: 'Sample Song',
          artist: 'Test Artist',
          fileUrl: 'https://amzn-s3-bucket-soundstorage.s3.ap-southeast-1.amazonaws.com/Da%CC%A3o+Bu%CC%9Bo%CC%9B%CC%81c+Hongkong+1999+_+%E6%BC%AB%E6%AD%A5%E9%A6%99%E6%B8%AF1999.mp3',
          lyrics: 'This is a test song for the music player'
        }
      ]
      setSongs(testSongs)
      setCurrentSong(testSongs[0])
      setSongsError(err.message || 'Không tải được danh sách bài hát.')
    } finally {
      setSongsLoading(false)
    }
  }, [])

  // Wrapper function to add song to history when played
  const handleSetCurrentSong = useCallback((song) => {
    if (!song) {
      setCurrentSong(null)
      return
    }

    // Set current song
    setCurrentSong(song)

    // Add to history asynchronously (non-blocking)
    const addToHistory = async () => {
      try {
        const payload = {
          songId: song.id || song._id,
          title: song.title || song.name,
          artist: typeof song.artist === 'string' ? song.artist : song.artist?.name,
          duration: song.duration
        }
        await historyApi.addHistory(payload)
      } catch (err) {
        // Silent fail - don't disrupt playback
        console.error('Error adding to history:', err)
      }
    }

    addToHistory()
  }, [])

  useEffect(() => {
    loadSongs()
  }, [loadSongs])

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        setCurrentSong: handleSetCurrentSong,
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
