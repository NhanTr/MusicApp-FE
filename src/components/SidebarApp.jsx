
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Music, Compass, Grid3x3, Heart, LogOut, Upload } from 'lucide-react'

function SidebarApp() {
  const navigate = useNavigate()
  const [user] = useState(null)
  const [genres] = useState(['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic'])

  function handleLogout() {
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-red-800 to-red-900 text-white flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-red-700">
        <Link to="/" className="flex items-center gap-2">
          <Music className="w-8 h-8" />
          <h1 className="text-2xl font-bold">MusicFlow</h1>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 bg-red-800/60 border-b border-red-700">
          <p className="text-sm text-red-100">Đã đăng nhập</p>
          <p className="font-semibold text-white truncate">
            {user.email?.split('@')[0] || 'User'}
          </p>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/music"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700/70 transition"
        >
          <Compass className="w-5 h-5" />
          <span>Nhạc Xu Hướng</span>
        </Link>

        <div className="px-4 py-2 text-sm font-semibold text-red-100 mt-6 mb-2">
          Thể Loại
        </div>
        {genres.map((genre) => (
          <Link
            key={genre}
            to={`/music/genre/${encodeURIComponent(genre.toLowerCase())}`}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-700/70 transition text-sm"
          >
            <Grid3x3 className="w-4 h-4" />
            <span>{genre}</span>
          </Link>
        ))}

        <Link
          to="/music/favorites"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700/70 transition mt-6"
        >
          <Heart className="w-5 h-5" />
          <span>My Album</span>
        </Link>

        <Link
          to="/music/upload"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700/70 transition"
        >
          <Upload className="w-5 h-5" />
          <span>Tải Nhạc</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-red-700">
        <Button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  )
}

export default SidebarApp
