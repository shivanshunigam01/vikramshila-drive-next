// src/pages/NewLaunchesPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Zap } from "lucide-react";

import acepro2 from "../assets/acepro-2.jpg";
import acepro3 from "../assets/acepro-3.jpg";
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
function formatINRShort(n: number) {
  if (!isFinite(n) || n <= 0) return "—";
  if (n >= 1e5) {
    const lakhs = n / 1e5;
    const val = Math.round(lakhs * 10) / 10;
    return `₹${val} Lakh`;
  }
  return formatINR(n);
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
  // (other fields omitted)
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
        const res = await getProducts(); // axios response
        // Accept either { data: [...] } or raw [...]
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

  // Filter ONLY new launches (handles 1 or "1")
  const newLaunchProducts = useMemo(
    () =>
      (allProducts || [])
        .filter((p) => Number(p.newLaunch) === 1)
        .filter((p) => {
          if (!searchTerm.trim()) return true;
          const hay = `${p.title ?? ""} ${p.category ?? ""} ${
            p.description ?? ""
          }`.toLowerCase();
          return hay.includes(searchTerm.toLowerCase());
        }),
    [allProducts, searchTerm]
  );

  // brochure download
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
          <li className="text-gray-400">›</li>
          <li className="text-white font-medium">New Launches</li>
        </ol>
      </nav>

      {/* Hero */}
      <div
        className="relative h-[450px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${launchBanner})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-3xl text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Tata Motors’ New & Upcoming Launches
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            From advanced SCVs to powerful trucks and EVs, explore the
            future-ready vehicles designed to drive your business ahead.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex gap-10">
        <main className="flex-1">
          {/* Latest Launches (dynamic) */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold">Latest Launches</h2>
              <Badge className="bg-green-700 text-white">Available Now</Badge>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search new launches"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {loading ? (
              <div className="text-gray-400">Loading launches…</div>
            ) : error ? (
              <div className="text-red-400">Error: {error}</div>
            ) : newLaunchProducts.length === 0 ? (
              <div className="text-gray-400">
                No new launches available right now.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newLaunchProducts.map((p) => {
                  const image = p.images?.[0];

                  return (
                    <Card
                      key={p._id}
                      className="bg-black border border-gray-800 rounded-2xl overflow-hidden group relative w-[280px] md:w-[300px]"
                    >
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-blue-600 text-white flex items-center gap-1">
                          <Zap className="w-3 h-3" /> New Launch
                        </Badge>
                      </div>

                      {/* Image */}
                      <CardHeader className="p-0 bg-black">
                        <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-black">
                          {image ? (
                            <img
                              src={image}
                              alt={p.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-900" />
                          )}
                        </div>
                      </CardHeader>

                      {/* Content */}
                      <CardContent className="p-4 flex flex-col bg-black text-white">
                        <CardTitle className="text-lg font-semibold mb-3 text-white">
                          {p.title}
                        </CardTitle>

                        {/* 3 spec columns */}
                        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-300 mb-4">
                          <div>
                            <p className="font-bold text-white">
                              {p.gvw || "—"}
                            </p>
                            <p className="text-xs text-gray-400">
                              Tonnage (GVW)
                            </p>
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {p.fuelTankCapacity || "—"}
                            </p>
                            <p className="text-xs text-gray-400">Fuel Tank</p>
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {p.payload || "—"}
                            </p>
                            <p className="text-xs text-gray-400">Payload</p>
                          </div>
                        </div>

                        {/* Buttons row */}
                        <div className="flex gap-3 mt-auto">
                          <Link
                            to={`/products/${p._id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-center"
                          >
                            Know More
                          </Link>

                          {/* Round PDF button (enabled only if brochure exists) */}
                          {p.brochureFile ? (
                            <button
                              onClick={() => handleDownload(p)}
                              className="flex items-center justify-center w-11 h-11 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white"
                            >
                              {downloadingId === p._id ? "…" : "PDF"}
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-700 text-gray-600 cursor-not-allowed"
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
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
