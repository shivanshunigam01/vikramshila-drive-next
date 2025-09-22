// OffersSlider.tsx
import { useEffect, useMemo, useRef, useState } from "react";
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
  return sd
    ? sd.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
}

/** A single scheme card with an image area matching the image's aspect ratio. */
function SchemeCard({
  scheme,
  active,
  className = "",
}: {
  scheme: Scheme;
  active: boolean;
  className?: string;
}) {
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
        className,
      ].join(" ")}
    >
      {/* Image wrapper */}
      <div
        className="relative rounded-xl overflow-hidden bg-black mb-4 w-full max-h-[75vh] mx-auto flex items-center justify-center"
        style={ratio ? { aspectRatio: ratio } : { aspectRatio: "16 / 9" }}
      >
        {photo ? (
          <img
            src={photo}
            alt={scheme.title || "Offer"}
            className="absolute inset-0 w-full h-full object-contain"
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const img = e.currentTarget as HTMLImageElement;
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
      <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
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
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  // Mobile scroller ref (for snap carousel)
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive breakpoint check (sync on mount + resize)
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? !window.matchMedia("(min-width: 768px)").matches
      : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    setIsMobile(!mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Fetch schemes
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getSchemes();
        setSchemes(Array.isArray(data) ? (data as Scheme[]) : []);
      } catch (e: any) {
        setErr(e?.message || "Failed to load schemes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto-advance every 4s
  useEffect(() => {
    if (!schemes.length) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % schemes.length);
    }, 4000);
    return () => clearInterval(t);
  }, [schemes.length]);

  // Keep index valid when list changes
  useEffect(() => {
    if (schemes.length && index >= schemes.length) setIndex(0);
  }, [schemes.length, index]);

  // On mobile: scroll to active card smoothly
  useEffect(() => {
    if (!isMobile) return;
    const container = scrollerRef.current;
    const el = cardRefs.current[index];
    if (container && el) {
      const left = el.offsetLeft - container.clientLeft - 16; // adjust padding (px-4)
      container.scrollTo({ left, behavior: "smooth" });
    }
  }, [index, isMobile]);

  const prev = () =>
    setIndex((i) =>
      schemes.length ? (i - 1 + schemes.length) % schemes.length : 0
    );
  const next = () =>
    setIndex((i) => (schemes.length ? (i + 1) % schemes.length : 0));

  // Skeletons while loading
  const skeletons = useMemo(
    () =>
      Array.from({ length: isMobile ? 1 : 3 }).map((_, i) => (
        <div
          key={`sk-${i}`}
          className="rounded-2xl p-4 bg-[#1b1e22] border border-gray-800 animate-pulse"
        >
          <div className="rounded-xl bg-black/40 w-full aspect-[16/9] mb-4" />
          <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
          <div className="h-3 bg-white/5 rounded w-full mb-1" />
          <div className="h-3 bg-white/5 rounded w-5/6" />
          <div className="h-3 bg-white/5 rounded w-1/3 mt-3" />
        </div>
      )),
    [isMobile]
  );

  return (
    <section className="w-full bg-black py-10 sm:py-12">
      <div className="container mx-auto px-4">
        <header className="mb-6 sm:mb-10 flex items-center justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Current Schemes &amp; Offers
          </h2>

          {/* Mobile controls (hidden on md+) */}
          {isMobile && schemes.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-9 h-9 grid place-items-center rounded-full bg-white/5 text-white hover:bg-white/10"
              >
                ‹
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="w-9 h-9 grid place-items-center rounded-full bg-white/5 text-white hover:bg-white/10"
              >
                ›
              </button>
            </div>
          )}
        </header>

        {/* STATES */}
        {loading ? (
          // Loading state
          <div
            className={
              isMobile
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            }
          >
            {skeletons}
          </div>
        ) : err ? (
          // Error state
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            {err}
          </div>
        ) : !schemes.length ? (
          // Empty state
          <div className="text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg p-4">
            No schemes available right now.
          </div>
        ) : (
          <>
            {/* Mobile: horizontal snap carousel */}
            <div
              className="md:hidden -mx-4 px-4" // full-bleed feel on phones
            >
              <div
                ref={scrollerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                style={{ scrollBehavior: "smooth" } as any}
              >
                {schemes.map((o, i) => (
                  <div
                    key={o._id || i}
                    ref={(el) => (cardRefs.current[i] = el)}
                    className="shrink-0 w-[85%] snap-start"
                  >
                    <SchemeCard scheme={o} active={i === index} />
                  </div>
                ))}
              </div>

              {/* Dots */}
              {schemes.length > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                  {schemes.map((_, i) => (
                    <button
                      key={`dot-${i}`}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition-all ${
                        i === index ? "bg-white w-5" : "bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop/Tablet: grid */}
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-6">
              {schemes.map((o, i) => (
                <SchemeCard key={o._id || i} scheme={o} active={i === index} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
