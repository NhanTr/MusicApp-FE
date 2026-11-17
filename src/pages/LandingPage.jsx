import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  AudioLines,
  Headphones,
  Heart,
  Upload,
} from "lucide-react";
import AppHeader from "@/components/AppHeader";
export default function LandingPage() {
  return (
    <div className="landing-page">
      <AppHeader showActions />
      <main>
        <section className="landing-hero">
          <div>
            <p className="eyebrow">
              <i />
              KHÔNG GIAN ÂM NHẠC CỦA RIÊNG BẠN
            </p>
            <h1>
              Ít ồn ào hơn.
              <br />
              Nhiều <em>âm nhạc</em> hơn.
            </h1>
            <p>
              Tìm những giai điệu mới. Giữ lại những bài hát yêu thích. Và dành
              một chút thời gian cho chính mình.
            </p>
            <div className="landing-cta">
              <Link to="/signup" className="primary-button">
                Bắt đầu lắng nghe
                <ArrowUpRight size={17} />
              </Link>
              <span>Thế giới âm nhạc của bạn.</span>
            </div>
          </div>
          <div className="landing-record" aria-label="Đĩa nhạc MusicFlow">
            <div className="vinyl-art">
              <div className="vinyl-center">
                <AudioLines />
                <span>MUSICFLOW</span>
              </div>
            </div>
            <p>
              <span>YOUR LISTENING ROOM</span>
              <span>VOL. 01</span>
            </p>
          </div>
        </section>
        <section className="landing-features">
          <div>
            <Headphones />
            <h2>Đắm mình trong giai điệu</h2>
            <p>
              Khám phá nghệ sĩ, album và những ca khúc đang được yêu thích. Một
              thế giới âm nhạc trong tầm tay.
            </p>
          </div>
          <div>
            <Heart />
            <h2>Giữ những điều bạn yêu</h2>
            <p>
              Lưu bài hát yêu thích và xây dựng playlist cho từng tâm trạng,
              từng khoảnh khắc của riêng bạn.
            </p>
          </div>
          <div>
            <Upload />
            <h2>Chia sẻ âm nhạc của bạn</h2>
            <p>
              Tải lên những giai điệu bạn muốn chia sẻ. Để âm nhạc kết nối những
              người cùng cảm hứng.
            </p>
          </div>
        </section>
      </main>
      <footer className="public-footer">
        <span>© 2026 MusicFlow</span>
        <span>MADE FOR LISTENING ↗</span>
      </footer>
    </div>
  );
}
