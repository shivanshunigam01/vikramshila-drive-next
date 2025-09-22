import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  downloadBrochureService,
} from "@/services/productService";

import { Button } from "@/components/ui/button";
import aceProImg from "@/assets/vehicle.png";
import aceLogo from "@/assets/acepro.png";

type ApiProduct = {
  _id: string;
  title: string;
  images?: string[];
  brochureFile?: any;
  gvw?: string;
  engine?: string;
  fuelTankCapacity?: string;
  fuelType?: string;
  payload?: string;
  category?: string;
  newLaunch?: number | string;
};

const STEP_MS = 3000;
const FIRST_DELAY_MS = 3000;

export default function LaunchSection() {
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const hoverRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Fetch products
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProducts();
        const data: ApiProduct[] = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (mounted) setAllProducts(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const newLaunches = useMemo(
    () => (allProducts || []).filter((p) => Number(p.newLaunch) === 1),
    [allProducts]
  );

  const slides: Array<{ kind: "hero" } | { kind: "product"; p: ApiProduct }> =
    useMemo(
      () => [
        { kind: "hero" } as const,
        ...newLaunches.map((p) => ({ kind: "product", p } as const)),
      ],
      [newLaunches]
    );

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (slides.length <= 1) return;
    const first = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => {
        if (!hoverRef.current) {
          setIndex((i) => (i + 1) % slides.length);
        }
      }, STEP_MS);
    }, FIRST_DELAY_MS);

    return () => {
      window.clearTimeout(first);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const goTo = (i: number) =>
    setIndex(((i % slides.length) + slides.length) % slides.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const handleDownload = async (p: ApiProduct) => {
    if (!p._id || !p.brochureFile) return;
    try {
      setDownloadingId(p._id);
      const res = await downloadBrochureService(p._id);
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      let filename = "brochure.pdf";
      const cd = res.headers["content-disposition"];
      if (cd) {
        const m = cd.match(/filename="?(.+?)"?$/);
        if (m && m[1]) filename = m[1];
      } else if ((p as any).brochureFile?.originalName) {
        filename = (p as any).brochureFile.originalName;
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Brochure download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="w-full bg-[#333333] py-12 sm:py-20">
      <div
        className="container mx-auto px-4 sm:px-6 relative isolate overflow-hidden"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {/* Hero Slide */}
          <div className="w-full shrink-0">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-16">
              <div className="flex-1 flex justify-center">
                <img
                  src={aceProImg}
                  alt="Ace Pro Vehicle"
                  className="w-full max-w-[220px] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
                />
              </div>
              <div className="flex-1 text-center md:text-left mt-6 md:mt-0">
                <div className="mb-6 sm:mb-8">
                  <img
                    src={aceLogo}
                    alt="Ace Pro Logo"
                    className="h-14 sm:h-20 md:h-24 lg:h-32 object-contain mx-auto md:mx-0"
                  />
                </div>
                <p className="text-white text-lg sm:text-xl md:text-3xl font-semibold leading-snug">
                  Step into the future of last-mile delivery with the{" "}
                  <span className="font-bold">Ace Pro</span>
                </p>
              </div>
            </div>
          </div>

          {/* Product Slides */}
          {(loading && slides.length === 1) || error ? (
            <div className="w-full shrink-0">
              <div className="w-full h-[220px] sm:h-[320px] grid place-items-center text-gray-200 text-sm sm:text-base">
                {loading ? "Loading launches…" : error}
              </div>
            </div>
          ) : (
            newLaunches.map((p) => {
              const img = p.images?.[0];
              return (
                <div key={p._id} className="w-full shrink-0">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-16">
                    <div className="flex-1 flex justify-center">
                      <div className="w-full max-w-[260px] sm:max-w-md md:max-w-lg aspect-[4/3] bg-black/30 rounded-xl flex items-center justify-center overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={p.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-gray-400">No image</div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left text-white mt-6 md:mt-0">
                      <span className="inline-flex items-center text-xs bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full mb-3 sm:mb-4">
                        New Launch
                      </span>
                      <h3 className="text-lg sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6">
                        {p.title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Spec label="GVW" value={p.gvw} />
                        <Spec label="Fuel Tank" value={p.fuelTankCapacity} />
                        <Spec label="Payload" value={p.payload} />
                        <Spec label="Fuel" value={p.fuelType} />
                        <Spec label="Engine" value={p.engine} />
                        <Spec label="Category" value={p.category || "—"} />
                      </div>
                      <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center md:justify-start">
                        <Link
                          to={`/products/${p._id}`}
                          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2.5 rounded-lg"
                        >
                          Know More
                        </Link>
                        {p.brochureFile ? (
                          <button
                            onClick={() => handleDownload(p)}
                            className="inline-flex items-center justify-center border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors px-5 py-2.5 rounded-lg"
                          >
                            {downloadingId === p._id
                              ? "Downloading…"
                              : "Download Brochure"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center justify-center border border-gray-700 text-gray-500 px-5 py-2.5 rounded-lg cursor-not-allowed"
                          >
                            Brochure Unavailable
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Controls + Dots */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 grid place-items-center"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 grid place-items-center"
              aria-label="Next"
            >
              ›
            </button>
            <div className="mt-4 sm:mt-6 flex justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all ${
                    i === index ? "bg-white w-5 sm:w-6" : "bg-gray-500"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-3 sm:p-4 h-full">
      <div className="text-[10px] sm:text-[11px] md:text-xs text-gray-300 leading-none mb-1">
        {label}
      </div>
      <div className="text-sm sm:text-base font-semibold text-white whitespace-normal break-words [overflow-wrap:anywhere] leading-snug">
        {value || "—"}
      </div>
    </div>
  );
}
