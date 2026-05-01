import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./features/auth/LoginPage";
import SignUpPage from "./features/auth/SignUpPage";
import MusicLayout from "./pages/music/MusicLayout";
import Trending from "./features/songs/Trending";
import Favorites from "./features/favorites/Favorites";
import Upload from "./features/upload/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/music" element={<MusicLayout />}>
          <Route index element={<Trending />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;