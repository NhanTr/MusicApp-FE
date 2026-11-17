import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Album,
  Clock3,
  Compass,
  Headphones,
  Heart,
  LibraryBig,
  LogOut,
  Music2,
  Search,
  TrendingUp,
  Upload,
  UserCircle2,
  Users,
} from "lucide-react";
import { authApi, clearAuthTokens } from "@/lib/api";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import Brand from "@/components/music/Brand";
const discovery = [
  ["/music", "Khám phá", Compass],
  ["/music/search", "Tìm kiếm", Search],
  ["/music/favorites", "Yêu thích", Heart],
];
const library = [
  ["/music/trending", "Xu hướng", TrendingUp],
  ["/music/songs", "Bài hát", Music2],
  ["/music/artists", "Nghệ sĩ", Users],
  ["/music/albums", "Album", Album],
  ["/music/playlists", "Playlist", LibraryBig],
  ["/music/history", "Lịch sử nghe", Clock3],
  ["/music/upload", "Tải nhạc", Upload],
  ["/music/profile", "Tài khoản", UserCircle2],
];
export default function SidebarApp({ mobileOpen = false, onNavigate }) {
  const navigate = useNavigate();
  const menuRef = useDialogFocus(mobileOpen, onNavigate);
  const [user, setUser] = useState(null);
  useEffect(() => {
    let active = true;
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
  async function logout() {
    try {
      await authApi.logout();
    } catch {
      /* Local session still clears if the server is unavailable. */
    } finally {
      clearAuthTokens();
      navigate("/login");
    }
  }
  const links = (items) =>
    items.map(([path, label, icon]) => (
      <NavLink
        to={path}
        end={path === "/music"}
        key={path}
        className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        onClick={onNavigate}
      >
        {(() => {
          const NavIcon = icon;
          return <NavIcon />;
        })()}
        <span>{label}</span>
      </NavLink>
    ));
  return (
    <aside
      ref={menuRef}
      role={mobileOpen ? "dialog" : undefined}
      aria-modal={mobileOpen ? true : undefined}
      id="music-navigation"
      className={`music-sidebar ${mobileOpen ? "mobile-open" : ""}`}
      aria-label="Thư viện âm nhạc"
    >
      <Brand />
      <div className="sidebar-scroll">
        <p className="sidebar-label">KHÔNG GIAN ÂM NHẠC</p>
        <nav className="sidebar-nav">{links(discovery)}</nav>
        <p className="sidebar-label">THƯ VIỆN CỦA BẠN</p>
        <nav className="sidebar-nav">{links(library)}</nav>
      </div>
      <div className="sidebar-bottom">
        <Headphones />
        <h2>
          Ít ồn ào hơn.
          <br />
          Nhiều âm nhạc hơn.
        </h2>
        <p>
          Những giai điệu bạn yêu.
          <br />
          Theo cách riêng của bạn.
        </p>
        <div className="sidebar-signout">
          <span>{user?.username || "MusicFlow"}</span>
          <button onClick={logout} aria-label="Đăng xuất">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
