import { useState } from "react";
import { Disc3 } from "lucide-react";
export default function Artwork({ src, title = "MusicFlow", className = "" }) {
  const [failedSrc, setFailedSrc] = useState(null);
  return (
    <div className={`artwork ${className}`}>
      {src && failedSrc !== src ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div className="artwork-fallback" aria-label={title}>
          <Disc3 aria-hidden="true" />
          <span>{title.slice(0, 1)}</span>
          <small>MUSICFLOW COLLECTION</small>
        </div>
      )}
    </div>
  );
}
