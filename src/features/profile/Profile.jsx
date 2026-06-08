import { useEffect, useState } from 'react'
import { LogOut, LockKeyhole, UserCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/lib/api'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      setLoading(true)
      setError('')

      try {
        const data = await authApi.me()
        if (isMounted) {
          setUser(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Không tải được thông tin tài khoản.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleUpdatePassword(e) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setUpdating(true)
    setError('')

    try {
      await authApi.updatePassword({
        newPassword,
        confirmNewPassword: confirmPassword,
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Không cập nhật được mật khẩu.')
    } finally {
      setUpdating(false)
    }
  }

  async function handleLogout() {
    try {
      await authApi.logout()
    } catch {
      // Ignore API failure and still clear session.
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/login')
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tài Khoản</h1>
          <p className="text-slate-600 mt-2">Thông tin người dùng và thay đổi mật khẩu.</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Đang tải hồ sơ...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && user && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle2 className="w-5 h-5 text-red-700" />
              <h2 className="text-lg font-semibold text-slate-900">Thông tin cá nhân</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-medium text-slate-900">Username:</span> {user.username || user.name || 'N/A'}</p>
              <p><span className="font-medium text-slate-900">Email:</span> {user.email || 'N/A'}</p>
              <p><span className="font-medium text-slate-900">Vai trò:</span> {user.role || 'User'}</p>
            </div>
          </section>

          <form onSubmit={handleUpdatePassword} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <LockKeyhole className="w-5 h-5 text-red-700" />
              <h2 className="text-lg font-semibold text-slate-900">Đổi mật khẩu</h2>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-red-300"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-red-300"
                required
              />
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
              >
                <LockKeyhole className="w-4 h-4" />
                {updating ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
