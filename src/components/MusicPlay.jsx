import { useEffect, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, ChevronUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

function MusicPlay({ songs = [], onSongChange } = {}) {
  const audioRef = useRef(null)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isShuffling, setIsShuffling] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none')
  const [showLyrics, setShowLyrics] = useState(false)
  const [queue, setQueue] = useState(songs)

  const currentSong = queue[currentSongIndex] || songs[0]

  useEffect(() => {
    setQueue(songs)
  }, [songs])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.url
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentSong])

  function togglePlay() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  function nextSong() {
    let nextIndex = currentSongIndex + 1
    if (nextIndex >= queue.length) {
      nextIndex = 0
    }
    setCurrentSongIndex(nextIndex)
    onSongChange?.(queue[nextIndex])
  }

  function prevSong() {
    let prevIndex = currentSongIndex - 1
    if (prevIndex < 0) {
      prevIndex = queue.length - 1
    }
    setCurrentSongIndex(prevIndex)
    onSongChange?.(queue[prevIndex])
  }

  function toggleShuffle() {
    if (isShuffling) {
      setQueue([...songs])
      setCurrentSongIndex(0)
    } else {
      const shuffled = [...songs].sort(() => Math.random() - 0.5)
      setQueue(shuffled)
      setCurrentSongIndex(0)
    }
    setIsShuffling(!isShuffling)
  }

  function toggleRepeat() {
    const modes = ['none', 'one', 'all']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  function handleEnded() {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      nextSong()
    }
  }

  function handleSeek(e) {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  function formatTime(time) {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  function getArtistName(song) {
    if (!song) return 'Unknown artist'
    if (typeof song.artist === 'string') return song.artist
    if (song.artist && typeof song.artist === 'object') {
      return song.artist.name || 'Unknown artist'
    }
    return 'Unknown artist'
  }

  if (!currentSong) {
    return <div className="text-center p-4 text-gray-500">Không có bài hát nào</div>
  }

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Lyrics Panel */}
      {showLyrics && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-80 overflow-y-auto p-4 relative">
            <button
              onClick={() => setShowLyrics(false)}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-1 text-red-700">{currentSong.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{getArtistName(currentSong)}</p>
            <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
              {currentSong.lyrics || 'Không có lời bài hát'}
            </div>
          </div>
        </div>
      )}

      {/* Player Bar */}
      <div className="fixed bottom-2 left-2 right-2 md:bottom-3 md:left-[calc(16rem+0.75rem)] md:right-3 bg-gradient-to-t from-red-800 to-red-700 text-white shadow-xl z-40 rounded-xl md:rounded-2xl">
        {/* Progress Bar */}
        <div className="px-3 pt-2.5 pb-1.5 md:px-4 md:pt-3 md:pb-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-0.5 md:h-1 bg-red-600 rounded-full appearance-none cursor-pointer accent-red-200"
          />
          <div className="flex justify-between text-[10px] md:text-xs text-red-100 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Player Controls */}
        <div className="px-3 py-2.5 md:px-4 md:py-3 flex items-center justify-between gap-2 md:gap-3">
          {/* Song Info */}
          <div className="flex-1 min-w-0 max-w-[35%] md:max-w-none">
            <p className="font-semibold truncate text-sm md:text-base text-white">{currentSong.title}</p>
            <p className="text-xs md:text-sm text-red-100 truncate">{getArtistName(currentSong)}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleShuffle}
              className={`h-7 w-7 p-0 md:h-8 md:w-8 md:p-0 text-white hover:bg-red-700 ${isShuffling ? 'bg-red-700' : ''}`}
              title="Shuffle"
            >
              <span className="text-xs md:text-sm">⇄</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={prevSong}
              className="h-7 w-7 p-0 md:h-8 md:w-8 md:p-0 text-white hover:bg-red-700"
            >
              <SkipBack className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>

            <Button
              onClick={togglePlay}
              className="h-8 min-w-8 md:h-9 md:min-w-9 px-2.5 md:px-3 bg-white text-red-700 hover:bg-red-100 font-semibold"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={nextSong}
              className="h-7 w-7 p-0 md:h-8 md:w-8 md:p-0 text-white hover:bg-red-700"
            >
              <SkipForward className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={toggleRepeat}
              className={`h-7 w-7 p-0 md:h-8 md:w-8 md:p-0 text-white hover:bg-red-700 ${repeatMode !== 'none' ? 'bg-red-700' : ''}`}
              title={`Repeat: ${repeatMode}`}
            >
              <span className="text-xs md:text-sm">{repeatMode === 'one' ? '🔂' : '🔁'}</span>
            </Button>
          </div>

          {/* Volume & Lyrics */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="hidden sm:flex items-center gap-1.5 w-20 md:w-24">
              <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-0.5 md:h-1 bg-red-600 rounded-full appearance-none cursor-pointer accent-red-200"
              />
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowLyrics(!showLyrics)}
              className={`h-7 w-7 p-0 md:h-8 md:w-8 md:p-0 text-white hover:bg-red-700 ${showLyrics ? 'bg-red-700' : ''}`}
              title="Show Lyrics"
            >
              <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MusicPlay
