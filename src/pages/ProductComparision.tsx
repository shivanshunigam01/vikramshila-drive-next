// src/pages/ProductComparision.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getProductById } from "@/services/product";
import { getCompetitionProductById } from "@/services/competitionService";
import {
  Share2,
  Download,
  Star,
  Eye,
  Heart,
  Truck,
  Settings,
  MoveRight,
} from "lucide-react";

/* ---------- Types ---------- */
interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: string;
  type?: "Tata" | "Competitor";
  brand?: string;
  payload?: string;
  engine?: string;
  torque?: string;
  clutchDia?: string;
  tyre?: string;
  drivercomfort?: string;
  mileage?: string; // <-- ADD THIS
  tyreLife?: string; // <-- ALSO ADD THIS IF YOU USE IT
  tyresCost?: string;
  monitoringFeatures?: string[];

  specifications?: {
    engine?: string;
    power?: string;
    torque?: string;
    fuelCapacity?: string;
    payload?: string;
    gvw?: string;
    wheelbase?: string;
    fuelType?: string;
    transmission?: string;
    tyreSize?: string;
    tyre?: string;
    clutchDia?: string;
  };

  reviews?: {
    avgRating?: number;
    totalReviews?: number;
    highlights?: string[];
  };
}

/* ---------- Helper Functions ---------- */
function formatINR(n: string | number) {
  const val = Number(n);
  if (!isFinite(val)) return "—";
  return val.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function Chips({ items }: { items: string[] }) {
  if (!items?.length)
    return <span className="inline-flex text-xs text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it}
          className="text-xs rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 px-2.5 py-1"
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function RatingChip({ rating, count }: { rating?: number; count?: number }) {
  const has = typeof rating === "number";
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-amber-200">
      <Star className="w-3.5 h-3.5 fill-current" />
      <span className="text-xs font-medium">
        {has ? rating!.toFixed(1) : "N/A"}
      </span>
      <span className="text-[11px] opacity-80">({count ?? 0})</span>
    </div>
  );
}

/* ---------- Component ---------- */
export default function ProductComparision() {
  const { productIds } = useParams<{ productIds: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Product | null>(
    null
  );

  /* ---------- Fetch Products ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      if (!productIds) return;
      setLoading(true);
      try {
        const ids = productIds.split(",").filter(Boolean);
        const idMap =
          (location.state as { idMap?: { id: string; type: string }[] })
            ?.idMap || [];

        const fetched = await Promise.allSettled(
          ids.map(async (id) => {
            const type =
              idMap.find((x) => x.id === id)?.type ||
              (id.startsWith("68e") ? "Competitor" : "Tata");

            const data =
              type === "Competitor"
                ? await getCompetitionProductById(id)
                : await getProductById(id);

            return { ...data, type };
          })
        );

        const valid = fetched
          .filter((r) => r.status === "fulfilled" && (r as any).value?._id)
          .map((r) => (r as PromiseFulfilledResult<any>).value);

        setProducts(valid);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [productIds, location.state]);

  /* ---------- Navigation Handlers ---------- */
  const goToReview = (product: Product) => {
    if (product.type === "Competitor") return;
    navigate("/review", { state: { product, from: "comparison4" } });
  };

  const openCompetitorDetails = async (id: string) => {
    try {
      const data = await getCompetitionProductById(id);
      setSelectedCompetitor(data);
    } catch (err) {
      console.error("❌ Error fetching competitor product:", err);
    }
  };

  const shareComparison = async () => {
    const text = `Compare selected vehicles — Vikramshila Automobiles`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Product Comparison",
          text,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
      }
    } else navigator.clipboard.writeText(window.location.href);
  };

  /* ---------- Loading ---------- */
  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading comparison...</p>
          </div>
        </div>
        <Footer />
      </div>
    );

  const metrics = [
    {
      label: "Payload",
      key: "payload",
      icon: <Truck className="w-4 h-4 text-blue-400" />,
    },
    {
      label: "Torque",
      key: "torque",
      icon: <Settings className="w-4 h-4 text-fuchsia-400" />,
    },
    {
      label: "Clutch Dia",
      key: "clutchDia",
      icon: <Settings className="w-4 h-4 text-sky-400" />,
    },
    {
      label: "Tyre",
      key: "tyre",
      icon: <Truck className="w-4 h-4 text-teal-400" />,
    },
  ];

  /* ---------- UI ---------- */
  return (
    <div className="bg-gradient-to-b from-[#0a0a0e] to-[#101217] min-h-screen text-white">
      <Helmet>
        <title>Compare Products | Vikramshila Automobiles</title>
      </Helmet>

      <Header />

      <div className="container mx-auto px-4 py-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center sm:text-left">
            Product Comparison
          </h1>
          <div className="flex gap-3">
            <Button
              onClick={shareComparison}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-green-500/20"
            >
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-slate-400/20"
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
        </div>

        {/* Product Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(
            products.length,
            3
          )} xl:grid-cols-${Math.min(products.length, 4)} gap-8 mb-12`}
        >
          {products.map((p) => (
            <Card
              key={p._id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 rounded-xl"
            >
              <CardHeader>
                <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden relative group">
                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.title}
                    className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() =>
                      setFavoriteProducts((prev) =>
                        prev.includes(p._id)
                          ? prev.filter((id) => id !== p._id)
                          : [...prev, p._id]
                      )
                    }
                    className="absolute top-3 right-3 bg-black/40 rounded-full p-2 backdrop-blur-sm hover:bg-black/70 transition-all duration-300"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favoriteProducts.includes(p._id)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <CardTitle className="text-white text-lg sm:text-xl font-bold mb-2 line-clamp-2">
                  {p.title?.trim() || p.brand?.trim() || "—"}
                </CardTitle>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {p.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    {formatINR(p.price)}
                  </div>
                  <RatingChip
                    rating={p.reviews?.avgRating}
                    count={p.reviews?.totalReviews}
                  />
                </div>

                {/* Actions */}
                <div className="mt-4 space-y-3">
                  {/* View Details — same color */}
                  <Button
                    onClick={() =>
                      p.type === "Competitor"
                        ? openCompetitorDetails(p._id)
                        : navigate(`/products/${p._id}`)
                    }
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded-lg"
                  >
                    <Eye className="w-4 h-4 mr-1" /> View Details
                  </Button>

                  {/* Proceed to Review — same blue, moved below */}
                  {p.type !== "Competitor" && (
                    <Button
                      onClick={() => goToReview(p)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg"
                    >
                      Proceed to Review <MoveRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              Key Specification Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-white/[0.06]">
                <tr>
                  <th className="text-left py-3 px-4 text-sm uppercase tracking-wide text-white/80">
                    Metric
                  </th>
                  {products.map((p) => (
                    <th
                      key={p._id}
                      className="text-left py-3 px-4 text-sm font-semibold text-white"
                    >
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, idx) => (
                  <tr
                    key={m.key}
                    className={`${
                      idx % 2 === 0 ? "bg-white/[0.02]" : ""
                    } border-b border-white/10 hover:bg-white/5 transition`}
                  >
                    <td className="py-3 px-4 text-sm text-white/80 flex items-center gap-2">
                      {m.icon} {m.label}
                    </td>
                    {products.map((p) => (
                      <td key={p._id + m.key} className="py-3 px-4 text-white">
                        {(p as any)[m.key] ||
                          p.specifications?.[
                            m.key as keyof typeof p.specifications
                          ] ||
                          "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* ================= EXPERT RECOMMENDATION SECTION ================= */}
        <Card className="border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl mt-10">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              Expert Recommendation
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {products.length === 2 ? (
              (() => {
                const [p1, p2] = products;

                // Numeric extraction helper
                const num = (v?: string) =>
                  Number(String(v).replace(/[^\d.]/g, "")) || 0;

                // Extract key parameters
                const payload1 = num(p1.payload);
                const payload2 = num(p2.payload);

                const torque1 = num(p1.torque);
                const torque2 = num(p2.torque);

                const price1 = num(p1.price);
                const price2 = num(p2.price);

                const mileage1 = num(p1.mileage);
                const mileage2 = num(p2.mileage);

                const verdict =
                  payload2 > payload1 && torque2 > torque1
                    ? `${p2.title} offers higher payload and torque, making it the better choice for heavy-duty applications.`
                    : payload1 > payload2 && mileage1 > mileage2
                    ? `${p1.title} is more economical with better mileage, ideal for rural or moderate load operations.`
                    : `Both models have unique strengths — choose based on your daily load and route conditions.`;

                return (
                  <div className="space-y-5">
                    {/* Summary Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h3 className="text-white font-semibold mb-2">
                          {p1.title}
                        </h3>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Payload: {p1.payload || "—"}</li>
                          <li>• Torque: {p1.torque || "—"}</li>
                          <li>• Mileage: {p1.mileage || "—"}</li>
                          <li>
                            • Best for: Rural roads, moderate load,
                            cost-efficient running
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h3 className="text-white font-semibold mb-2">
                          {p2.title}
                        </h3>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• Payload: {p2.payload || "—"}</li>
                          <li>• Torque: {p2.torque || "—"}</li>
                          <li>• Mileage: {p2.mileage || "—"}</li>
                          <li>
                            • Best for: Heavy construction, sand/aggregate
                            movement
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Final Verdict */}
                    <div className="mt-6 p-5 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/40 rounded-xl shadow-lg">
                      <h3 className="text-lg font-bold text-blue-300 mb-2">
                        Final Expert Verdict
                      </h3>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {verdict}
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-gray-400 text-sm">
                Add two products to generate expert comparison.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />

      {/* Competitor Details Modal */}
      <Dialog
        open={!!selectedCompetitor}
        onOpenChange={() => setSelectedCompetitor(null)}
      >
        <DialogContent className="max-w-3xl bg-gray-900 text-white border border-gray-700 rounded-xl shadow-xl">
          {selectedCompetitor ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  {selectedCompetitor.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-6 mt-4">
                <img
                  src={selectedCompetitor.images?.[0] || "/placeholder.png"}
                  alt={selectedCompetitor.title}
                  className="rounded-lg object-contain w-full bg-black"
                />
                <div>
                  <p className="text-gray-400 mb-2 text-sm">
                    {selectedCompetitor.description}
                  </p>
                  <p className="text-lg font-semibold mb-2">
                    Price: {formatINR(selectedCompetitor.price)}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Engine: {selectedCompetitor.engine || "—"}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Payload: {selectedCompetitor.payload || "—"}
                  </p>
                  <p className="text-gray-300 mb-1">
                    Fuel Type:{" "}
                    {selectedCompetitor.specifications?.fuelType || "—"}
                  </p>
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2 text-cyan-400">
                      Monitoring Features
                    </h4>
                    <Chips
                      items={selectedCompetitor.monitoringFeatures || []}
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => setSelectedCompetitor(null)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() =>
                        navigate(`/products/${selectedCompetitor._id}`)
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      Open Full Product Page{" "}
                      <MoveRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Loading details...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
