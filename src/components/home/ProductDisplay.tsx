import { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  getProducts,
  downloadBrochureService,
} from "@/services/productService";

export default function ProductDisplay() {
  const [categoryMap, setCategoryMap] = useState<Record<string, any[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionTopRef = useRef<HTMLDivElement | null>(null);
  const headerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          const grouped: Record<string, any[]> = {};

          res.data.data.forEach((item) => {
            const cat = item.category || "Others";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
          });

          setCategoryMap(grouped);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const toggle = (cat: string) => {
    const isSame = expandedCategory === cat;

    // If user clicks the same category -> just close it
    if (isSame) {
      setExpandedCategory(null);
      return;
    }

    // If another category is clicked:
    // 1) Scroll to "Our Products"
    if (sectionTopRef.current) {
      const rect = sectionTopRef.current.getBoundingClientRect();
      const offset = 20; // adjust if you have sticky header
      const targetY = window.scrollY + rect.top - offset;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }

    // 2) After scroll starts, open the new category
    setTimeout(() => {
      setExpandedCategory(cat);
    }, 300); // 300ms = scroll + nice feel
  };

  const handleDownload = async (p: any) => {
    try {
      setDownloadingId(p._id);
      const res = await downloadBrochureService(p._id);
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      let filename = "brochure.pdf";
      const cd = res.headers["content-disposition"];
      if (cd) {
        const match = cd.match(/filename="?(.+?)"?$/);
        if (match?.[1]) filename = match[1];
      } else if (p.brochureFile?.originalName) {
        filename = p.brochureFile.originalName;
      }

      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      setDownloadingId(null);
    } catch (err) {
      console.error("Download error:", err);
      setDownloadingId(null);
    }
  };

  return (
    <section className="w-full bg-black py-12 md:py-16">
      <div ref={sectionTopRef} className="container mx-auto px-4 max-w-7xl">
        <header className="mb-10 md:mb-14 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-wide uppercase">
            Our Products
          </h2>
        </header>

        <div className="space-y-3 md:space-y-4">
          {Object.entries(categoryMap).map(([category, products]) => {
            const isExpanded = expandedCategory === category;

            return (
              <div
                key={category}
                className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* CATEGORY HEADER */}
                <div
                  ref={(el) => (headerRefs.current[category] = el)}
                  onClick={() => toggle(category)}
                  className="cursor-pointer p-5 ..."
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                      <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        {category}
                      </h3>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">
                        {products.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:block text-blue-400 text-sm font-medium">
                        {isExpanded ? "Collapse" : "Expand"}
                      </span>
                      <div
                        className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/30"
                        style={{
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                          backgroundColor: isExpanded
                            ? "rgba(37, 99, 235, 0.2)"
                            : "rgba(37, 99, 235, 0.1)",
                        }}
                      >
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CATEGORY EXPANDED GRID - Height transition wrapper */}
                <div
                  style={{
                    height: isExpanded
                      ? contentRefs.current[category]?.scrollHeight || "auto"
                      : "0px",
                    overflow: "hidden",
                    transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div
                    ref={(el) => {
                      contentRefs.current[category] = el;
                    }}
                    className="p-5 md:p-7 bg-gradient-to-b from-gray-950 to-black"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6">
                      {products.map((p) => {
                        const image = p.images?.[0];

                        return (
                          <div
                            key={p._id}
                            className="bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-2xl overflow-hidden flex flex-col h-full group"
                          >
                            {/* Image */}
                            <div className="p-0 relative">
                              <div className="aspect-[4/3] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center overflow-hidden relative">
                                {image ? (
                                  <>
                                    <img
                                      src={image}
                                      alt={p.title}
                                      className="w-full h-full object-contain group-hover:scale-110"
                                      style={{
                                        transition: "transform 0.5s ease",
                                      }}
                                    />
                                    <div
                                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100"
                                      style={{ transition: "opacity 0.3s" }}
                                    ></div>
                                  </>
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
                                    <svg
                                      className="w-20 h-20 text-gray-700"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                              <h4 className="text-base md:text-lg mb-4 text-white h-14 flex items-center font-bold">
                                {p.title}
                              </h4>

                              {/* Specs grid */}
                              <div className="grid grid-cols-3 gap-2.5 text-center mb-5">
                                <div
                                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2.5 h-20 flex flex-col justify-center border border-gray-700/50 hover:border-blue-500/30"
                                  style={{ transition: "border-color 0.2s" }}
                                >
                                  <p className="font-bold text-white text-sm md:text-base">
                                    {p.gvw || "—"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1 font-medium">
                                    Tonnage
                                  </p>
                                </div>
                                <div
                                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2.5 h-20 flex flex-col justify-center border border-gray-700/50 hover:border-blue-500/30"
                                  style={{ transition: "border-color 0.2s" }}
                                >
                                  <p className="font-bold text-white text-sm md:text-base line-clamp-2">
                                    {p.fuelTankCapacity || "—"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1 font-medium">
                                    Fuel Tank
                                  </p>
                                </div>
                                <div
                                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2.5 h-20 flex flex-col justify-center border border-gray-700/50 hover:border-blue-500/30"
                                  style={{ transition: "border-color 0.2s" }}
                                >
                                  <p className="font-bold text-white text-sm md:text-base">
                                    {p.payload || "—"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1 font-medium">
                                    Payload
                                  </p>
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex gap-3 mt-auto">
                                <Link
                                  to={`/products/${p._id}`}
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl text-center font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02]"
                                  style={{ transition: "all 0.2s ease" }}
                                >
                                  Explore Details
                                </Link>

                                {p.brochureFile ? (
                                  <button
                                    onClick={() => handleDownload(p)}
                                    disabled={downloadingId === p._id}
                                    className="w-12 h-12 rounded-xl border-2 border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center text-xs font-bold disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.05]"
                                    style={{ transition: "all 0.2s ease" }}
                                    title="Download Brochure"
                                  >
                                    {downloadingId === p._id ? (
                                      <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                          fill="none"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="w-12 h-12 rounded-xl border-2 border-gray-700 bg-gray-800/30 text-gray-600 cursor-not-allowed opacity-40"
                                    title="No Brochure Available"
                                  >
                                    <svg
                                      className="w-5 h-5 mx-auto"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
