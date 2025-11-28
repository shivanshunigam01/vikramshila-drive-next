// src/pages/NewLaunchesPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, X } from "lucide-react";

import launchBanner from "../assets/fleet-care_new_banner.jpg";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { getProducts } from "@/services/productService";

// ---------- helpers ----------
function formatINR(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}
function formatINRShort(n?: number | string) {
  const num = typeof n === "string" ? parseFloat(n) : n ?? 0;
  if (!isFinite(num) || num <= 0) return "";
  if (num >= 1e5) {
    const lakhs = Math.round((num / 1e5) * 10) / 10;
    return `₹${lakhs} Lakh`;
  }
  return formatINR(num);
}
function extractEnginePower(engine?: string): string | undefined {
  if (!engine) return undefined;
  const kW = engine.match(/(\d+(?:\.\d+)?)\s*kW/i)?.[1];
  const PS = engine.match(/(\d+(?:\.\d+)?)\s*PS/i)?.[1];
  if (kW && PS) return `${kW} kW (${PS} PS)`;
  if (kW) return `${kW} kW`;
  if (PS) return `${PS} PS`;
  return engine;
}
const API_URL = import.meta.env.VITE_API_URL;
// ---------- API type ----------
type ApiProduct = {
  brochureFile?: any;
  _id: string;
  title: string;
  description?: string;
  price?: string;
  images?: string[];
  category?: string;
  gvw?: string;
  engine?: string;
  fuelTankCapacity?: string;
  fuelType?: string;
  payload?: string;
  newLaunch?: number | string;
};

export default function NewLaunchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProducts();
        const data: ApiProduct[] = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
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

  // only new launches + search
  const newLaunchProducts = useMemo(
    () =>
      (allProducts || [])
        .filter((p) => Number(p.newLaunch) === 1)
        .filter((p) => {
          if (!searchTerm.trim()) return true;
          const hay = `${p.title ?? ""} ${p.category ?? ""} ${
            p.description ?? ""
          } ${p.fuelType ?? ""}`.toLowerCase();
          return hay.includes(searchTerm.toLowerCase());
        }),
    [allProducts, searchTerm]
  );

  const handleDownload = (p: ApiProduct) => {
    if (!p._id || !p.brochureFile) {
      alert("Brochure not available");
      return;
    }

    const brochureUrl = `${API_URL}/products/${p._id}/brochure`;

    window.open(brochureUrl, "_blank");
  };

  return (
    <div className="bg-black text-white font-sans">
      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 py-4 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-500">›</li>
          <li className="text-white/90">New Launches</li>
        </ol>
      </nav>

      {/* Hero */}
      <div
        className="relative h-[420px] bg-cover bg-center flex items-center justify-center rounded-none"
        style={{ backgroundImage: `url(${launchBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />
        <div className="relative z-10 max-w-3xl text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Discover Tata Motors' New & Upcoming Launches
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Explore future-ready vehicles designed to drive your business ahead.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sticky search + count */}
        <div className="sticky top-16 z-20 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/5 mb-8">
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search new launches (model, fuel, etc.)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-20 py-2 rounded-lg bg-gray-900/70 border border-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span>Results:</span>
              <span className="text-white font-semibold">
                {loading ? "…" : newLaunchProducts.length}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : newLaunchProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newLaunchProducts.map((p) => {
              const image = p.images?.[0];
              const enginePower = extractEnginePower(p.engine);
              const priceTag = formatINRShort(p.price);

              return (
                <Card
                  key={p._id}
                  className="group relative bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col h-full"
                >
                  {/* NEW badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-1.5 px-3 py-1 shadow-lg shadow-blue-600/40">
                      <Zap className="w-3.5 h-3.5" />
                      New Launch
                      <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </Badge>
                  </div>

                  {/* Image */}
                  <CardHeader className="p-0 relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center overflow-hidden relative">
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt={p.title}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  </CardHeader>

                  <CardContent className="p-5 flex flex-col flex-1">
                    {/* Title + Price */}
                    <div className="mb-4">
                      <CardTitle className="text-base md:text-lg font-bold leading-snug line-clamp-2 mb-2">
                        {p.title}
                      </CardTitle>
                      {priceTag && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">Starting at</span>
                          <span className="text-blue-400 font-semibold text-base">
                            {priceTag}
                          </span>
                        </div>
                      )}
                      {p.category && (
                        <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium">
                          {p.category}
                        </span>
                      )}
                    </div>

                    {/* Specs grid */}
                    <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2.5 h-20 flex flex-col justify-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                        <p className="font-bold text-white text-sm">
                          {p.gvw || "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          GVW
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2.5 h-20 flex flex-col justify-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                        <p className="font-bold text-white text-sm line-clamp-2">
                          {p.fuelTankCapacity || "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          Fuel Tank
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2.5 h-20 flex flex-col justify-center border border-gray-700/50 hover:border-blue-500/30 transition-colors">
                        <p className="font-bold text-white text-sm">
                          {p.payload || "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          Payload
                        </p>
                      </div>
                    </div>

                    {/* Engine info */}
                    {enginePower && (
                      <div className="mb-4 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400">Engine Power</p>
                        <p className="text-sm text-white font-semibold">
                          {enginePower}
                        </p>
                      </div>
                    )}

                    {/* CTA buttons */}
                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl text-center font-semibold transition-all duration-200 text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:scale-[1.02]"
                      >
                        Quick View
                      </button>

                      {p.brochureFile ? (
                        <button
                          onClick={() => handleDownload(p)}
                          disabled={downloadingId === p._id}
                          className="w-12 h-12 rounded-xl border-2 border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:scale-[1.05]"
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
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black max-w-4xl w-full rounded-2xl shadow-2xl border border-gray-700 relative overflow-y-auto max-h-[90vh]">
            {/* Close button */}
            <button
              className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              onClick={() => setSelectedProduct(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* NEW badge in modal */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-1.5 px-3 py-1.5 shadow-lg">
                <Zap className="w-4 h-4" />
                New Launch
              </Badge>
            </div>

            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
              {selectedProduct.images?.[0] ? (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-20 h-20 text-gray-700">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {selectedProduct.title}
                </h2>

                {formatINRShort(selectedProduct.price) && (
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gray-400">Starting Price:</span>
                    <span className="text-2xl text-blue-400 font-bold">
                      {formatINRShort(selectedProduct.price)}
                    </span>
                  </div>
                )}

                {selectedProduct.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium">
                    {selectedProduct.category}
                  </span>
                )}
              </div>

              {selectedProduct.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">
                    Description
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">GVW</p>
                  <p className="text-lg font-bold text-white">
                    {selectedProduct.gvw || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">Payload</p>
                  <p className="text-lg font-bold text-white">
                    {selectedProduct.payload || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">Fuel Tank</p>
                  <p className="text-lg font-bold text-white">
                    {selectedProduct.fuelTankCapacity || "—"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">Fuel Type</p>
                  <p className="text-lg font-bold text-white">
                    {selectedProduct.fuelType || "—"}
                  </p>
                </div>
              </div>

              {extractEnginePower(selectedProduct.engine) && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-1">Engine Power</p>
                  <p className="text-lg font-bold text-white">
                    {extractEnginePower(selectedProduct.engine)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/products/${selectedProduct._id}`}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl text-center font-semibold transition-all duration-200 shadow-lg shadow-blue-600/30"
                >
                  View Full Details
                </Link>

                {selectedProduct.brochureFile && (
                  <button
                    onClick={() => handleDownload(selectedProduct)}
                    disabled={downloadingId === selectedProduct._id}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 border border-gray-700 disabled:opacity-50"
                  >
                    {downloadingId === selectedProduct._id
                      ? "Downloading..."
                      : "Download Brochure"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- UI Components ---------- */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden"
        >
          <div className="aspect-[4/3] bg-gray-800 animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="h-5 bg-gray-800 rounded w-3/4 animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 bg-gray-800 rounded-xl animate-pulse" />
              <div className="h-20 bg-gray-800 rounded-xl animate-pulse" />
              <div className="h-20 bg-gray-800 rounded-xl animate-pulse" />
            </div>
            <div className="h-12 bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-gray-900/40 rounded-2xl border border-gray-700">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-3">No New Launches Found</h3>
        <p className="text-gray-400 text-sm mb-6">
          Check back soon for exciting new vehicles or explore our complete
          range.
        </p>
        <Link
          to="/products"
          className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg shadow-blue-600/30"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
