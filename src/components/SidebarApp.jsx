
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Clock3, Compass, Heart, Home, LibraryBig, LogOut, Search, Upload, UserCircle2 } from 'lucide-react'

import { authApi, clearAuthTokens } from '@/lib/api'

function SidebarApp() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      try {
        const data = await authApi.me()
        if (isMounted) {
          setUser(data)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLogout() {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout API errors and clear local session anyway.
    } finally {
      clearAuthTokens()
      navigate('/login')
    }
  }

  function navClass({ isActive }) {
    return [
      'flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm',
      isActive ? 'bg-red-700/90 text-white shadow-sm' : 'hover:bg-red-700/70 text-red-50',
    ].join(' ')
  }

  return (
    <aside className="flex h-[calc(100vh-5.5rem)] w-[280px] min-w-[280px] max-w-[280px] flex-col overflow-y-auto rounded-2xl bg-gradient-to-b from-red-800 to-red-900 text-white shadow-lg">

      {/* User Info */}
      {user && (
        <div className="border-b border-red-700 bg-red-800/60 p-4">
          <p className="text-sm text-red-100">Đã đăng nhập</p>
          <p className="font-semibold text-white truncate">
            {user.email?.split('@')[0] || 'User'}
          </p>
          <p className="mt-1 text-xs text-red-100/80 truncate">{user.email || ''}</p>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/music"
          end
          className={navClass}
        >
          <Home className="w-5 h-5" />
          <span>Tổng Quan</span>
        </NavLink>

        <NavLink
          to="/music/trending"
          className={navClass}
        >
          <Compass className="w-5 h-5" />
          <span>Nhạc Xu Hướng</span>
        </NavLink>

        <NavLink
          to="/music/search"
          className={navClass}
        >
          <Search className="w-5 h-5" />
          <span>Tìm Kiếm</span>
        </NavLink>

        <NavLink
          to="/music/playlists"
          className={navClass}
        >
          <LibraryBig className="w-5 h-5" />
          <span>Playlist</span>
        </NavLink>

        <NavLink
          to="/music/favorites"
          className={navClass}
        >
          <Heart className="w-5 h-5" />
          <span>Yêu Thích</span>
        </NavLink>

        <NavLink
          to="/music/history"
          className={navClass}
        >
          <Clock3 className="w-5 h-5" />
          <span>Lịch Sử Nghe</span>
        </NavLink>

        <NavLink
          to="/music/upload"
          className={navClass}
        >
          <Upload className="w-5 h-5" />
          <span>Tải Nhạc</span>
        </NavLink>

        <NavLink
          to="/music/profile"
          className={navClass}
        >
          <UserCircle2 className="w-5 h-5" />
          <span>Tài Khoản</span>
        </NavLink>
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
