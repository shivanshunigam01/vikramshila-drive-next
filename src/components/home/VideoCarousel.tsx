import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { videos } from "@/data/products";

type VideoItem = { id: string; title: string };

export default function VideoCarousel() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? !window.matchMedia("(min-width: 768px)").matches
      : true
  );

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  // responsive breakpoint watcher
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    setIsMobile(!mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // keep index valid
  useEffect(() => {
    if (videos.length && active >= videos.length) setActive(0);
  }, [active]);

  // derive current visible card on mobile scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !isMobile) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        let bestIdx = 0;
        let bestDelta = Infinity;
        const left = el.scrollLeft;
        for (let i = 0; i < cardRefs.current.length; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;
          const delta = Math.abs(card.offsetLeft - left);
          if (delta < bestDelta) {
            bestDelta = delta;
            bestIdx = i;
          }
        }
        setActive(bestIdx);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  const scrollToIndex = (i: number) => {
    setActive(i);
    if (!isMobile) return;
    const container = scrollerRef.current;
    const card = cardRefs.current[i];
    if (container && card) {
      container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
  };

  const prev = () =>
    scrollToIndex((active - 1 + videos.length) % Math.max(videos.length, 1));
  const next = () => scrollToIndex((active + 1) % Math.max(videos.length, 1));

  if (!videos?.length) {
    return (
      <section className="w-full bg-black py-12">
        <div className="container mx-auto px-4">
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Videos
            </h2>
            <p className="text-gray-400 mt-2">No videos available right now.</p>
          </header>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-6 md:mb-10 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Videos
            </h2>
            <p className="text-gray-400 mt-2">
              Walkthroughs, testimonials, and dealer insights
            </p>
          </div>

          {/* Mobile controls */}
          {isMobile && videos.length > 1 && (
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

        {/* MOBILE: horizontal snap carousel */}
        <div className="md:hidden -mx-4 px-4">
          <div
            ref={scrollerRef}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") prev();
              if (e.key === "ArrowRight") next();
            }}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {videos.map((v: VideoItem, i) => (
              <Dialog key={v.id}>
                <DialogTrigger asChild>
                  <button
                    ref={(el) => (cardRefs.current[i] = el)}
                    className={[
                      "shrink-0 w-[85%] snap-start rounded-xl overflow-hidden bg-[#1e2125] border transition duration-300 text-left",
                      i === active
                        ? "border-blue-600 ring-2 ring-blue-500/40 shadow-lg shadow-blue-900/30"
                        : "border-gray-800 hover:shadow-xl",
                    ].join(" ")}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video">
                      <img
                        src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                        alt={`${v.title} video thumbnail`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 grid place-items-center">
                        <span className="px-3 py-1 rounded-full bg-blue-600/80 text-white text-xs font-medium">
                          ▶ Play
                        </span>
                      </div>
                    </div>
                    <div className="p-3 text-sm text-gray-300 font-medium line-clamp-2">
                      {v.title}
                    </div>
                  </button>
                </DialogTrigger>

                {/* Video Modal */}
                <DialogContent className="max-w-[92vw] sm:max-w-3xl md:max-w-4xl p-2 bg-black border border-gray-800">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={`https://www.youtube-nocookie.com/embed/${v.id}?modestbranding=1&rel=0&playsinline=1`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Dots */}
          {videos.length > 1 && (
            <div className="mt-5 flex justify-center gap-2">
              {videos.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to video ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === active ? "bg-white w-5" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP/TABLET: grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((v) => (
            <Dialog key={v.id}>
              <DialogTrigger asChild>
                <button className="rounded-xl overflow-hidden bg-[#1e2125] border border-gray-800 shadow-lg hover:shadow-xl transition duration-300 text-left">
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={`${v.title} video thumbnail`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="px-3 py-1 rounded-full bg-blue-600/80 text-white text-xs font-medium">
                        ▶ Play
                      </span>
                    </div>
                  </div>
                  <div className="p-3 text-sm text-gray-300 font-medium line-clamp-2">
                    {v.title}
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-[92vw] sm:max-w-3xl md:max-w-4xl p-2 bg-black border border-gray-800">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube-nocookie.com/embed/${v.id}?modestbranding=1&rel=0&playsinline=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
