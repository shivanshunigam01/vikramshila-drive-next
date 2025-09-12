// src/pages/NewLaunchesPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Zap } from "lucide-react";

import launchBanner from "../assets/fleet-care_new_banner.jpg";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import {
  getProducts,
  downloadBrochureService,
} from "@/services/productService";

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

// ---------- API type ----------
type ApiProduct = {
  brochureFile?: any;
  _id: string;
  title: string;
  description?: string;
  price?: string; // "1850000"
  images?: string[];
  category?: string;
  gvw?: string; // "9950 kg"
  engine?: string;
  fuelTankCapacity?: string; // "90 L"
  fuelType?: string; // "Diesel"
  payload?: string; // "7000 kg"
  newLaunch?: number | string; // 1 => new
};

export default function NewLaunchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
      } else if (p.brochureFile?.originalName) {
        filename = p.brochureFile.originalName;
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Brochure download failed:", err);
      alert("Brochure download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
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
            Discover Tata Motors’ New & Upcoming Launches
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {newLaunchProducts.map((p) => {
              const image = p.images?.[0];
              const enginePower = extractEnginePower(p.engine);
              const priceTag = formatINRShort(p.price);

              return (
                <Card
                  key={p._id}
                  className="group relative w-full max-w-[300px] rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.03]
                             border border-white/10 hover:border-blue-500/30 transition
                             shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]"
                >
                  {/* NEW badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-blue-600/90 text-white gap-1">
                      <Zap className="w-3 h-3" />
                      New
                      <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </Badge>
                  </div>

                  {/* Image */}
                  <CardHeader className="p-0">
                    <div className="aspect-[4/3] bg-black flex items-center justify-center overflow-hidden rounded-t-2xl">
                      {image ? (
                        <img
                          src={image}
                          alt={p.title}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 flex flex-col">
                    {/* Title + optional price */}
                    <div className="mb-2">
                      <CardTitle className="text-base font-semibold leading-snug line-clamp-2">
                        {p.title}
                      </CardTitle>
                      {priceTag && (
                        <div className="mt-1 text-sm text-blue-300">
                          Starting at{" "}
                          <span className="font-medium">{priceTag}</span>
                        </div>
                      )}
                    </div>

                    {/* Specs row */}
                    <div className="grid grid-cols-3 gap-3 text-center text-[12px] text-gray-300 mb-4">
                      <SpecItem value={p.gvw || "—"} label="GVW" />
                      <SpecItem
                        value={p.fuelTankCapacity || "—"}
                        label="Fuel"
                      />
                      <SpecItem value={p.payload || "—"} label="Payload" />
                    </div>

                    {/* Engine / Fuel */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <span className="truncate">
                        {enginePower
                          ? `Power: ${enginePower}`
                          : p.fuelType || "—"}
                      </span>
                      {p.category && (
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
                          {p.category}
                        </span>
                      )}
                    </div>

                    {/* CTA row */}
                    <div className="flex gap-3 mt-auto">
                      <Link
                        to={`/products/${p._id}`}
                        className="flex-1 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                      >
                        Know More
                      </Link>

                      {p.brochureFile ? (
                        <button
                          onClick={() => handleDownload(p)}
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                          title="Download brochure"
                        >
                          {downloadingId === p._id ? "…" : "PDF"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex items-center justify-center w-11 h-11 rounded-full border border-white/10 text-gray-500 cursor-not-allowed"
                          title="Brochure not available"
                        >
                          PDF
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
    </div>
  );
}

/* ---------- tiny UI pieces (local) ---------- */
function SpecItem({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <p className="font-semibold text-white text-[13px]">{value}</p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="w-full max-w-[300px] rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
        >
          <div className="aspect-[4/3] bg-white/[0.06] animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-white/[0.06] rounded w-3/4 animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 bg-white/[0.06] rounded animate-pulse" />
            </div>
            <div className="h-9 bg-white/[0.06] rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-gray-900/40 rounded-xl border border-white/10">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-2">No new launches</h3>
        <p className="text-gray-400 text-sm">
          Check back soon or explore our full vehicle range.
        </p>
        <Link
          to="/products"
          className="inline-flex mt-4 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
