import { AudioLines } from "lucide-react";
import { Link } from "react-router-dom";
export default function Brand({ to = "/music" }) {
  return (
    <Link to={to} className="brand" aria-label="MusicFlow — trang chủ">
      <AudioLines aria-hidden="true" />
      <span>
        musicflow<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
