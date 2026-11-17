import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { Disc3, Library, LogOut, Music2, Shield, Users } from "lucide-react";
import { authApi, clearAuthTokens } from "@/lib/api";
import Brand from "@/components/music/Brand";
export default function AdminLayout() {
  const navigate = useNavigate();
  async function logout() {
    try {
      await authApi.logout();
    } catch {
      /* Clear local credentials even when logout is unavailable. */
    } finally {
      clearAuthTokens();
      navigate("/login");
    }
  }
  const links = [
    ["artists", "Nghệ sĩ", Users],
    ["albums", "Album", Disc3],
    ["songs", "Bài hát", Music2],
    ["accounts", "Tài khoản", Shield],
  ];
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Brand />
        <div>
          <Link to="/music" className="inline-flex items-center gap-2">
            <Library size={15} />
            Về thư viện ↗
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-2">
            <LogOut size={15} />
            Đăng xuất
          </button>
        </div>
      </header>
      <div className="admin-body">
        <aside>
          <nav className="admin-nav" aria-label="Quản trị">
            <p className="eyebrow">MUSICFLOW STUDIO</p>
            {links.map(([path, label, icon]) => (
              <NavLink
                key={path}
                to={`/admin/${path}`}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                {(() => {
                  const NavIcon = icon;
                  return <NavIcon />;
                })()}
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
