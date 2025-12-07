import { useState } from "react";

export default function SmoothImage({
  src,
  alt,
  className = "",
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`
          w-full h-full object-cover duration-700 ease-out
          ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-lg"}
        `}
      />
    </div>
  );
}
