import { useState } from "react";
import "./Avatar.css";

// Round profile picture. Falls back to the person's initial when there is no picture or it fails to load.
// `size` (px) is optional - leave it out to size the avatar from CSS instead.
const Avatar = ({ src, name, size }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  const style = size ? { width: size, height: size, fontSize: size * 0.45 } : undefined;

  return (
    <div className="avatar" style={style}>
      {showImage ? (
        <img
          src={src}
          alt={name ? `${name}'s profile picture` : "Profile picture"}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </div>
  );
};

export default Avatar;
