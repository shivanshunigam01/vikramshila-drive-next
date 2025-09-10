// OffersSlider.tsx
import { useEffect, useMemo, useState } from "react";
import { getSchemes } from "@/services/schemeServices";

type Scheme = {
  _id?: string;
  title?: string;
  description?: string;
  startDate?: string | number | Date;
  endDate?: string | number | Date;
  photos?: string[];
};

function safeDate(d: any) {
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}
function fmt(d?: any) {
  const sd = safeDate(d);
  return sd ? sd.toLocaleDateString() : "—";
}

/**
 * A single scheme card with an image area that automatically
 * adapts to the image's real aspect-ratio.
 */
function SchemeCard({ scheme, active }: { scheme: Scheme; active: boolean }) {
  const photo = scheme?.photos?.[0];
  const [ratio, setRatio] = useState<string | undefined>(undefined);

  const borderClasses = active
    ? "border-blue-600 ring-2 ring-blue-500/40 shadow-lg shadow-blue-900/30 scale-[1.01]"
    : "border-gray-800";

  return (
    <div
      className={[
        "rounded-2xl p-4 bg-[#1b1e22] border flex flex-col transition-all duration-300",
        borderClasses,
      ].join(" ")}
    >
      {/* Image wrapper: uses CSS aspect-ratio so the box matches the image */}
      <div
        className="relative rounded-xl overflow-hidden bg-black mb-4 w-full max-h-[75vh] mx-auto flex items-center justify-center"
        style={
          ratio
            ? { aspectRatio: ratio } // e.g. "1080 / 1920" (portrait)
            : { aspectRatio: "16 / 9" } // safe default until image loads
        }
      >
        {photo ? (
          <img
            src={photo}
            alt={scheme.title || "Offer"}
            className="absolute inset-0 w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const img = e.currentTarget;
              // Set exact aspect ratio so the wrapper matches the image.
              if (img.naturalWidth && img.naturalHeight) {
                setRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
              }
            }}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-500 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white leading-snug">
        {scheme.title || "Untitled Scheme"}
      </h3>
      {scheme.description && (
        <p className="text-sm text-gray-300 mt-2 line-clamp-2">
          {scheme.description}
        </p>
      )}
      <div className="mt-3 text-xs text-gray-400">
        Valid: {fmt(scheme.startDate)} – {fmt(scheme.endDate)}
      </div>
    </div>
  );
}

export default function OffersSlider() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getSchemes().then((data) =>
      setSchemes(Array.isArray(data) ? (data as Scheme[]) : [])
    );
  }, []);

  useEffect(() => {
    if (!schemes.length) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % schemes.length);
    }, 4000);
    return () => clearInterval(t);
  }, [schemes.length]);

  // Keep index valid even if list shrinks
  useEffect(() => {
    if (schemes.length && index >= schemes.length) setIndex(0);
  }, [schemes.length, index]);

  return (
    <section className="w-full bg-black py-12">
      <div className="container mx-auto px-4">
        <header className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Current Schemes &amp; Offers
          </h2>
        </header>

        {/* 
          Layout:
          - 1 column on small screens (big, easy to read)
          - 2 columns on md
          - 3 columns on xl
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {schemes.map((o, i) => (
            <SchemeCard key={o._id || i} scheme={o} active={i === index} />
          ))}
        </div>
      </div>
    </section>
  );
}
