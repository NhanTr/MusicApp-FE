import { Link } from "react-router-dom";
import { Music, Play, Heart, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2">
            <Music className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">MusicFlow</span>
          </Link>

          <div className="flex gap-4">
            <Link to="/login">
              <Button className="text-red-600 border border-red-600 hover:bg-red-50">
                Đăng nhập
              </Button>
            </Link>

            <Link to="/signup">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Đăng ký
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Phát nhạc của bạn,
            <span className="text-red-600"> Cách của bạn</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            MusicFlow là ứng dụng phát nhạc hiện đại cho phép bạn tải lên, quản lý và phát những bài hát yêu thích mà không bị giới hạn.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6">
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Tính năng nổi bật
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-xl text-center">
              <Upload className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Tải Nhạc Của Bạn</h3>
              <p className="text-gray-600">
                Tải những bài hát yêu thích lên và xây dựng thư viện nhạc riêng
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-xl text-center">
              <Play className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Phát Nhạc Hoàn Hảo</h3>
              <p className="text-gray-600">
                Điều khiển phát nhạc với đầy đủ tính năng
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-xl text-center">
              <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Yêu Thích & Chia Sẻ</h3>
              <p className="text-gray-600">
                Tạo playlist và chia sẻ âm nhạc
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>&copy; 2026 MusicFlow</p>
      </footer>
    </div>
  );
}