import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import SignUpPage from "./features/auth/SignUpPage";
import MusicLayout from "./pages/music/MusicLayout";
import Trending from "./features/songs/Trending";
import Favorites from "./features/favorites/Favorites";
import Upload from "./features/upload/Upload";
import SearchPage from "./features/search/SearchPage";
import Playlists from "./features/playlists/Playlists";
import History from "./features/history/History";
import Profile from "./features/profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/music" element={<MusicLayout />}>
          <Route index element={<Trending />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;