import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronRight, Compass, Heart, Menu, Search, X } from "lucide-react";
import { authApi, getAccessToken } from "@/lib/api";
import Brand from "@/components/music/Brand";
const labels = {
  music: "Khám phá",
  trending: "Xu hướng",
  songs: "Bài hát",
  artists: "Nghệ sĩ",
  albums: "Album",
  search: "Tìm kiếm",
  playlists: "Playlist",
  favorites: "Yêu thích",
  history: "Lịch sử nghe",
  profile: "Tài khoản",
  upload: "Tải nhạc",
};
export default function AppHeader({
  showActions = false,
  menuOpen,
  onMenuToggle,
}) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  useEffect(() => {
    let active = true;
    if (getAccessToken())
      authApi
        .me()
        .then((me) => {
          if (active) setUser(me);
        })
        .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  if (showActions)
    return (
      <header className="public-header">
        <Brand to="/" />
        <nav>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/signup" className="primary-button">
            Bắt đầu ngay
          </Link>
        </nav>
      </header>
    );
  const section = location.pathname.split("/")[2] || "music";
  const title = labels[section] || "Thư viện";
  const initial = (user?.username || user?.email || "M")
    .slice(0, 1)
    .toUpperCase();
  const admin =
    String(user?.role || "")
      .toLowerCase()
      .includes("admin") ||
    user?.roles?.some((r) => String(r).toLowerCase().includes("admin"));
  return (
    <>
      <div className="mobile-topbar">
        <Brand />
        <nav aria-label="Điều hướng nhanh">
          <NavLink to="/music" end aria-label="Khám phá">
            <Compass size={19} />
          </NavLink>
          <NavLink to="/music/search" aria-label="Tìm kiếm">
            <Search size={19} />
          </NavLink>
          <NavLink to="/music/favorites" aria-label="Yêu thích">
            <Heart size={19} />
          </NavLink>
          <button
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            aria-controls="music-navigation"
            onClick={onMenuToggle}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </nav>
      </div>
      <header className="music-header">
        <div className="breadcrumbs">
          <Link to="/music">Thư viện của bạn</Link>
          <ChevronRight size={13} />
          <span>{title}</span>
        </div>
        <div className="header-actions">
          <span className="header-status">YOUR LISTENING ROOM</span>
          {admin && (
            <Link className="text-xs text-primary" to="/admin">
              Quản trị ↗
            </Link>
          )}
          <Link
            to="/music/profile"
            className="header-avatar"
            aria-label="Tài khoản"
          >
            {initial}
          </Link>
        </div>
      </header>
    </>
  );
}
