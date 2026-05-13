import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { favoritesApi } from '@/lib/api'

export default function LikeButton({ songId, initialLiked = false, onLikeChange }) {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Update local state when initialLiked prop changes
  useEffect(() => {
    setIsLiked(initialLiked)
  }, [initialLiked, songId])

  const handleToggleLike = async (e) => {
    e.stopPropagation() // Prevent triggering parent click handlers

    if (isLoading) return

    try {
      setIsLoading(true)
      setError('')

      if (isLiked) {
        // Unlike song
        await favoritesApi.unlikeSong(songId)
        setIsLiked(false)
      } else {
        // Like song
        await favoritesApi.likeSong(songId)
        setIsLiked(true)
      }

      // Notify parent component
      if (onLikeChange) {
        onLikeChange(!isLiked)
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật yêu thích')
      console.error('Like/Unlike error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${
        isLiked
          ? 'text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isLiked ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
    >
      <Heart
        className="w-5 h-5"
        fill={isLiked ? 'currentColor' : 'none'}
        strokeWidth={isLiked ? 0 : 2}
      />
    </button>
  )
}
