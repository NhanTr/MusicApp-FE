import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarApp from "@/components/SidebarApp";
import { MusicProvider } from "@/contexts/MusicContext";
import MusicPlay from "@/components/MusicPlay";
import AppHeader from "@/components/AppHeader";
function InnerLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <div className="music-shell" key="music-layout">
      {menuOpen && (
        <button
          className="mobile-menu-backdrop"
          aria-label="Đóng menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <SidebarApp mobileOpen={menuOpen} onNavigate={closeMenu} />
      <div className="music-main">
        <AppHeader
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((v) => !v)}
        />
        <main className="music-content" key={location.pathname}>
          <Outlet />
        </main>
      </div>
      <MusicPlay />
    </div>
  );
}
export default function MusicLayout() {
  return (
    <MusicProvider>
      <InnerLayout />
    </MusicProvider>
  );
}
