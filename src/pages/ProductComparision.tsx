// src/pages/Compare.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { getProductById } from "@/services/product";
import {
  ArrowLeft,
  Check,
  X,
  Download,
  Share2,
  Star,
  Award,
  TrendingUp,
  Filter,
  Eye,
  Heart,
  Truck,
  Settings,
  ChevronLeft,
  ThumbsUp,
  MoveRight,
} from "lucide-react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: string;
  specifications?: {
    engine?: string;
    power?: string; // e.g. "100 hp" or "75 kW"
    torque?: string; // e.g. "220 Nm"
    fuelCapacity?: string;
    payload?: string; // e.g. "1700 kg"
    gvw?: string;
    wheelbase?: string;
    fuelType?: string;
    transmission?: string; // e.g. "5-speed synchromesh"
    tyreSize?: string; // e.g. "185 R14"
  };
  features?: string[];

  // Optional fields to support comparison UX
  monitoringFeatures?: string[]; // e.g. ["Fleetedge", "Driver Monitoring"]
  reviews?: {
    avgRating?: number; // 0–5
    totalReviews?: number; // count
    highlights?: string[];
  };
  transmissionQualityScore?: number; // 0–10 if available
  driverComfortScore?: number; // 0–10 if available
}

type TcoInput = {
  vehiclePrice: number;
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  downPayment: number;
  monthlyRunning: number;
  mileage: number;
  fuelPrice: number;
  monthlyMaintenance: number;
  insuranceYear: number;
  tyresCost: number;
  tyreLife: number;
  resalePct5yr: number;
};
type TcoResult = {
  productId: string;
  productTitle: string;
  monthlyEmi: number;
  monthlyFuel: number;
  monthlyInsurance: number;
  monthlyTyre: number;
  monthlyMaintenance: number;
  monthlyOwnership: number;
  costPerKm: number;
  annualOwnership: number;
  fiveYearTco: number;
  inputs: TcoInput;
};

type ProfitInput = {
  vehiclePrice: number;
  tcoPerKm: number;
  monthlyRunning: number;
  billedPct: number;
  freightRate: number;
  addOnPerKm: number;
  fixedAddOns: number;
  downPayment: number;
  resalePct5yr: number;
  payloadTon?: number;
};
type ProfitResult = {
  productId: string;
  productTitle: string;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  breakevenRate: number;
  annualProfit: number;
  fiveYearProfit: number;
  roi5yr: number;
  paybackMonths: number;
  inputs: ProfitInput;
};

// Matches ReviewQuote expectations
type FinanceData = {
  vehiclePrice: number;
  downPaymentPercentage: number;
  downPaymentAmount: number;
  tenure: number; // in months
  interestRate: number; // annual %
  loanAmount: number;
  estimatedEMI: number;
};

function formatINR(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

// ---------- Helpers for new comparison metrics ----------
function parseNumberFromSpec(spec?: string): number | null {
  if (!spec) return null;
  const n = parseFloat(spec.replace(/,/g, "").match(/[\d.]+/)?.[0] ?? "");
  return isNaN(n) ? null : n;
}

function Chips({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it}
          className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded-full"
        >
          {it}
        </span>
      ))}
    </div>
  );
}

const COMFORT_KEYWORDS = [
  "ac",
  "air conditioner",
  "power steering",
  "tilt steering",
  "tilt & telescopic",
  "adjustable seat",
  "lumbar",
  "recline",
  "suspended seat",
  "cabin suspension",
  "music system",
  "armrest",
  "low nvh",
  "nvh",
];

function comfortScoreFromFeatures(features?: string[]): number {
  if (!features?.length) return 0;
  const f = features.map((x) => x.toLowerCase());
  return COMFORT_KEYWORDS.reduce(
    (acc, kw) => acc + (f.some((s) => s.includes(kw)) ? 1 : 0),
    0
  );
}

const TRANSMISSION_QUALITY_HINTS = [
  "synchromesh",
  "5-speed",
  "6-speed",
  "smooth shift",
  "overdrive",
  "heavy duty clutch",
  "servo",
  "single plate dry clutch",
];

function transmissionQualityHeuristic(spec?: string): number {
  if (!spec) return 0;
  const lower = spec.toLowerCase();
  return TRANSMISSION_QUALITY_HINTS.reduce(
    (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
    0
  );
}
// -------------------------------------------------------

export default function ProductComparison() {
  const { productIds } = useParams<{ productIds: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { tcoResults, profitResults } = (location.state || {}) as {
    tcoResults?: TcoResult[];
    profitResults?: ProfitResult[];
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "specifications" | "features" | "dimensions"
  >("overview");
  const [comparisonMode, setComparisonMode] = useState<
    "detailed" | "simplified"
  >("detailed");
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productIds) return;
      setLoading(true);
      try {
        const ids = productIds.split(",");
        const productPromises = ids.map((id) => getProductById(id));
        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products for comparison:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [productIds]);

  const toggleFavorite = (productId: string) => {
    setFavoriteProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const shareComparison = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Product Comparison - Vikramshila Automobiles",
          text: `Compare ${products[0]?.title} vs ${products[1]?.title}`,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const downloadComparison = () => window.print();

  const getWinner = (
    value1?: string,
    value2?: string,
    type: "higher" | "lower" = "higher"
  ) => {
    if (!value1 || !value2) return null;
    const num1 = parseFloat(value1.replace(/[^\d.]/g, ""));
    const num2 = parseFloat(value2.replace(/[^\d.]/g, ""));
    if (isNaN(num1) || isNaN(num2)) return null;
    if (type === "higher")
      return num1 > num2 ? "product1" : num2 > num1 ? "product2" : null;
    return num1 < num2 ? "product1" : num2 < num1 ? "product2" : null;
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading comparison...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (products.length !== 2 && products.length !== 1) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Invalid Comparison</h1>
            <p className="text-gray-400 mb-8">
              Please select 1 or 2 products to compare. You currently have{" "}
              {products.length} selected.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const product1 = products[0];
  const product2 = products[1];

  const tcoById: Record<string, TcoResult> = (tcoResults || []).reduce(
    (acc, r) => {
      acc[r.productId] = r;
      return acc;
    },
    {} as Record<string, TcoResult>
  );

  const profitById: Record<string, ProfitResult> = (profitResults || []).reduce(
    (acc, r) => {
      acc[r.productId] = r;
      return acc;
    },
    {} as Record<string, ProfitResult>
  );

  const selectedIds = productIds?.split(",") || [];

  const goBackToProfit = () => {
    const selectedIds = (productIds || "").split(",").filter(Boolean);
    navigate("/products", {
      state: { reopen: "profit", selectedIds, tcoResults, profitResults },
    });
  };

  // Build the FinanceData expected by ReviewQuote from TCO inputs/result
  const buildFinanceFor = (p: Product): FinanceData | null => {
    const t = tcoById[p._id];
    if (!t) return null;
    const i = t.inputs;
    const downPct =
      i.vehiclePrice && i.vehiclePrice > 0
        ? (i.downPayment / i.vehiclePrice) * 100
        : 0;
    return {
      vehiclePrice: Math.round(i.vehiclePrice),
      downPaymentPercentage: Math.round(downPct * 100) / 100,
      downPaymentAmount: Math.round(i.downPayment),
      tenure: Math.round(i.tenureYears * 12),
      interestRate: i.interestRate,
      loanAmount: Math.round(i.loanAmount),
      estimatedEMI: Math.round(t.monthlyEmi),
    };
  };

  // Navigate to Review with the chosen product; if no TCO yet, send user to Profit/TCO setup
  const proceedToReview = (p: Product) => {
    const financeData = buildFinanceFor(p);
    if (!financeData) {
      // No finance/TCO info yet — reopen Profit calculator with this product preselected
      const selectedIds = [p._id];
      navigate("/products", {
        state: { reopen: "profit", selectedIds, tcoResults, profitResults },
      });
      return;
    }
    // IMPORTANT: change "/review" to your actual route if different
    navigate("/review", {
      state: {
        product: {
          _id: p._id,
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          images: p.images,
          brochureFile: p.brochureFile,
        },
        financeData,
      },
    });
  };

  const ComparisonRow = ({
    label,
    value1,
    value2,
    highlight = false,
    showWinner = false,
    winnerType = "higher",
    icon,
  }: {
    label: string;
    value1?: string;
    value2?: string;
    highlight?: boolean;
    showWinner?: boolean;
    winnerType?: "higher" | "lower";
    icon?: React.ReactNode;
  }) => {
    const winner = showWinner ? getWinner(value1, value2, winnerType) : null;
    return (
      <tr
        className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors ${
          highlight ? "bg-gray-900/30" : ""
        }`}
      >
        <td className="py-4 px-4 font-medium text-gray-300">
          <div className="flex items-center gap-2">
            {icon}
            {label}
          </div>
        </td>
        <td
          className={`py-4 px-4 ${
            winner === "product1"
              ? "text-green-400 font-semibold"
              : "text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {value1 || "N/A"}
            {winner === "product1" && (
              <Award className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </td>
        <td
          className={`py-4 px-4 ${
            winner === "product2"
              ? "text-green-400 font-semibold"
              : "text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {value2 || "N/A"}
            {winner === "product2" && (
              <Award className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </td>
      </tr>
    );
  };

  const FeatureComparison = ({
    feature,
    product1Features,
    product2Features,
  }: {
    feature: string;
    product1Features: string[];
    product2Features: string[];
  }) => {
    const hasFeature1 = product1Features?.includes(feature);
    const hasFeature2 = product2Features?.includes(feature);
    return (
      <tr className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
        <td className="py-4 px-4 text-gray-300">{feature}</td>
        <td className="py-4 px-4 text-center">
          <div
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
              hasFeature1 ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            {hasFeature1 ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <X className="w-5 h-5 text-red-400" />
            )}
          </div>
        </td>
        <td className="py-4 px-4 text-center">
          <div
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
              hasFeature2 ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            {hasFeature2 ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <X className="w-5 h-5 text-red-400" />
            )}
          </div>
        </td>
      </tr>
    );
  };

  const allFeatures = Array.from(
    new Set([...(product1?.features || []), ...(product2?.features || [])])
  );
  const getFeatureScore = (p: Product) => {
    const total = allFeatures.length || 1;
    const mine = p.features?.length || 0;
    return Math.round((mine / total) * 100);
  };

  // ---------- Pairwise scoring for "Best Recommendation" ----------
  type MetricScoreLog = { label: string; winner?: 0 | 1; weight: number };
  function pairwiseScore(pA: Product, pB?: Product) {
    const logs: MetricScoreLog[] = [];
    if (!pB) return { scores: [0, 0] as [number, number], logs };

    let sA = 0;
    let sB = 0;

    function award(
      label: string,
      aVal: number | null,
      bVal: number | null,
      higherIsBetter: boolean,
      weight: number
    ) {
      if (aVal === null && bVal === null) return logs.push({ label, weight });
      if (aVal !== null && bVal === null) {
        sA += weight;
        return logs.push({ label, winner: 0, weight });
      }
      if (aVal === null && bVal !== null) {
        sB += weight;
        return logs.push({ label, winner: 1, weight });
      }
      if (aVal === null || bVal === null) return logs.push({ label, weight });

      if (Math.abs(aVal - bVal) < 1e-9) {
        sA += weight / 2;
        sB += weight / 2;
        return logs.push({ label, weight });
      }
      const betterA = higherIsBetter ? aVal > bVal : aVal < bVal;
      if (betterA) {
        sA += weight;
        logs.push({ label, winner: 0, weight });
      } else {
        sB += weight;
        logs.push({ label, winner: 1, weight });
      }
    }

    const tA = tcoById[pA._id];
    const tB = pB ? tcoById[pB._id] : undefined;
    const prA = profitById[pA._id];
    const prB = pB ? profitById[pB._id] : undefined;

    const payloadA = parseNumberFromSpec(pA.specifications?.payload);
    const payloadB = parseNumberFromSpec(pB?.specifications?.payload);

    const powerA = parseNumberFromSpec(pA.specifications?.power);
    const powerB = parseNumberFromSpec(pB?.specifications?.power);

    const torqueA = parseNumberFromSpec(pA.specifications?.torque);
    const torqueB = parseNumberFromSpec(pB?.specifications?.torque);

    const transQualA =
      pA.transmissionQualityScore ??
      transmissionQualityHeuristic(pA.specifications?.transmission) ??
      0;
    const transQualB =
      pB?.transmissionQualityScore ??
      transmissionQualityHeuristic(pB?.specifications?.transmission) ??
      0;

    const comfortA =
      pA.driverComfortScore ??
      Math.min(10, comfortScoreFromFeatures(pA.features)) ??
      0;
    const comfortB =
      pB?.driverComfortScore ??
      Math.min(10, comfortScoreFromFeatures(pB?.features)) ??
      0;

    const monA = pA.monitoringFeatures?.length ?? 0;
    const monB = pB?.monitoringFeatures?.length ?? 0;

    const ratingA = pA.reviews?.avgRating ?? null;
    const ratingB = pB?.reviews?.avgRating ?? null;

    // Weights reflect your priority order
    award(
      "TCO: Cost/km",
      tA?.costPerKm ?? null,
      tB?.costPerKm ?? null,
      false,
      3.0
    );
    award(
      "TCO: 5-yr",
      tA?.fiveYearTco ?? null,
      tB?.fiveYearTco ?? null,
      false,
      1.0
    );

    award(
      "Profit: Monthly",
      prA?.monthlyProfit ?? null,
      prB?.monthlyProfit ?? null,
      true,
      3.0
    );
    award(
      "Profit: 5-yr",
      prA?.fiveYearProfit ?? null,
      prB?.fiveYearProfit ?? null,
      true,
      1.0
    );

    award("Payload", payloadA, payloadB, true, 2.0);

    award("Monitoring Features", monA, monB, true, 1.0);
    award("Customer Review", ratingA, ratingB, true, 1.5);

    award("Engine Power", powerA, powerB, true, 1.0);
    award("Torque", torqueA, torqueB, true, 1.0);

    award("Transmission Quality", transQualA, transQualB, true, 1.0);

    award("Driver Comfort", comfortA, comfortB, true, 1.5);

    return { scores: [sA, sB] as [number, number], logs };
  }

  const recommendation =
    products.length === 2
      ? pairwiseScore(product1, product2)
      : { scores: [0, 0] as [number, number], logs: [] };
  const [scoreA, scoreB] = recommendation.scores;
  const winnerIndex =
    products.length === 2
      ? scoreA > scoreB
        ? 0
        : scoreB > scoreA
        ? 1
        : -1
      : 0;

  // Pick top-3 decisive metrics to display as reasons
  const topReasons =
    products.length === 2
      ? recommendation.logs
          .filter((l) => l.winner !== undefined)
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 3)
      : [];

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>
          {products.length === 2
            ? `Compare ${products[0].title} vs ${products[1].title} | Vikramshila Automobiles`
            : `Compare ${products[0].title} | Vikramshila Automobiles`}
        </title>
        <meta
          name="description"
          content={
            products.length === 2
              ? `Detailed comparison between ${products[0].title} and ${products[1].title}. Compare specifications, features, prices, TCO, and Profit.`
              : `Detailed view for ${products[0].title} with TCO and Profit.`
          }
        />
      </Helmet>

      <Header />

      {/* Breadcrumb + actions */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-400">
              <button
                onClick={goBackToProfit}
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Profit Calculator
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() =>
                  setComparisonMode(
                    comparisonMode === "detailed" ? "simplified" : "detailed"
                  )
                }
                variant="outline"
                size="sm"
                className="border-gray-600 text-black hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                {comparisonMode === "detailed" ? "Simplified" : "Detailed"}
              </Button>
              <Button
                onClick={shareComparison}
                variant="outline"
                size="sm"
                className="border-gray-600 text-black hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Product Comparison
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Compare features, specifications, price, TCO and Profit side by side
          </p>
        </div>

        {/* Product headers */}
        <div
          className={`grid grid-cols-1 ${
            products.length === 2 ? "lg:grid-cols-2" : ""
          } gap-8 mb-12`}
        >
          {products.map((product, index) => (
            <Card
              key={product._id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <CardHeader className="p-0 relative">
                <div className="aspect-[4/3] bg-black overflow-hidden rounded-t-lg relative group">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favoriteProducts.includes(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                    {product.title}
                    {tcoById[product._id] && (
                      <span className="text-[10px] uppercase tracking-wide bg-green-600/20 text-green-400 border border-green-600/40 px-2 py-1 rounded">
                        TCO set
                      </span>
                    )}
                    {profitById[product._id] && (
                      <span className="text-[10px] uppercase tracking-wide bg-amber-600/20 text-amber-400 border border-amber-600/40 px-2 py-1 rounded">
                        Profit set
                      </span>
                    )}
                    {index === 0 ? (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Product A
                      </span>
                    ) : products.length === 2 ? (
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                        Product B
                      </span>
                    ) : null}
                  </CardTitle>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {getFeatureScore(product)}%
                    </div>
                    <div className="text-xs text-gray-400">Feature Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {product.features?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Features</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    {product.price}
                  </div>
                  <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/products/${product._id}`}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-center py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </Link>
                  <Button
                    onClick={() => proceedToReview(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Review <MoveRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TCO Summary */}
        {tcoResults && tcoResults.length >= 1 && (
          <Card className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-600/30 mb-10">
            <CardHeader>
              <CardTitle className="text-xl">
                TCO Summary (from your inputs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`grid ${
                  products.length === 2 ? "md:grid-cols-2" : ""
                } gap-6`}
              >
                {products.map((p) => {
                  const t = tcoById[p._id];
                  if (!t) return null;
                  return (
                    <div
                      key={p._id}
                      className="rounded-lg border border-gray-800 p-4 bg-gray-900"
                    >
                      <div className="font-semibold mb-2 text-white">
                        {p.title}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <Row k="Monthly EMI" v={formatINR(t.monthlyEmi)} />
                        <Row k="Monthly Fuel" v={formatINR(t.monthlyFuel)} />
                        <Row
                          k="Monthly Insurance"
                          v={formatINR(t.monthlyInsurance)}
                        />
                        <Row k="Monthly Tyres" v={formatINR(t.monthlyTyre)} />
                        <Row
                          k="Monthly Maintenance"
                          v={formatINR(t.monthlyMaintenance)}
                        />
                        <Row
                          k="Monthly Ownership"
                          v={formatINR(t.monthlyOwnership)}
                        />
                        <Row
                          k="Cost per km"
                          v={`₹ ${t.costPerKm.toFixed(2)}`}
                        />
                        <Row
                          k="Annual Ownership"
                          v={formatINR(t.annualOwnership)}
                        />
                        <Row k="5-Year TCO" v={formatINR(t.fiveYearTco)} />
                      </div>
                      <div className="text-xs text-gray-400 mt-3">
                        Inputs: {t.inputs.monthlyRunning} km/mo, mileage{" "}
                        {t.inputs.mileage} km/l, fuel ₹{t.inputs.fuelPrice} per
                        unit, insurance {formatINR(t.inputs.insuranceYear)}/yr,
                        tyres {formatINR(t.inputs.tyresCost)} set /{" "}
                        {t.inputs.tyreLife} km, resale {t.inputs.resalePct5yr}%.
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profit Summary */}
        {profitResults && profitResults.length >= 1 && (
          <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-600/30 mb-10">
            <CardHeader>
              <CardTitle className="text-xl">Profit Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`grid ${
                  products.length === 2 ? "md:grid-cols-2" : ""
                } gap-6`}
              >
                {products.map((p) => {
                  const r = profitById[p._id];
                  if (!r) return null;
                  return (
                    <div
                      key={p._id}
                      className="rounded-lg border border-gray-800 p-4 bg-gray-900"
                    >
                      <div className="font-semibold mb-2 text-white">
                        {p.title}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <Row
                          k="Monthly Revenue"
                          v={formatINR(r.monthlyRevenue)}
                        />
                        <Row k="Monthly Cost" v={formatINR(r.monthlyCost)} />
                        <Row
                          k="Monthly Profit"
                          v={formatINR(r.monthlyProfit)}
                        />
                        <Row
                          k="Breakeven Rate (₹/billed km)"
                          v={
                            isFinite(r.breakevenRate)
                              ? `₹ ${r.breakevenRate.toFixed(2)}`
                              : "—"
                          }
                        />
                        <Row k="Annual Profit" v={formatINR(r.annualProfit)} />
                        <Row
                          k="5-Year Profit"
                          v={formatINR(r.fiveYearProfit)}
                        />
                        <Row
                          k="ROI (5 yr)"
                          v={
                            isFinite(r.roi5yr)
                              ? `${(r.roi5yr * 100).toFixed(1)} %`
                              : "—"
                          }
                        />
                        <Row
                          k="Payback (months)"
                          v={
                            isFinite(r.paybackMonths)
                              ? r.paybackMonths.toFixed(1)
                              : "—"
                          }
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-3">
                        Inputs: TCO ₹{r.inputs.tcoPerKm}/km, running{" "}
                        {r.inputs.monthlyRunning} km/mo, billed{" "}
                        {r.inputs.billedPct}%, freight ₹{r.inputs.freightRate}
                        /ton/km, add-ons ₹{r.inputs.addOnPerKm}/km & ₹
                        {r.inputs.fixedAddOns}/mo, resale{" "}
                        {r.inputs.resalePct5yr}%.
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Comparison (10 requested points) */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 mb-10">
          <CardHeader>
            <CardTitle className="text-xl">Key Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-900/60">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-400">
                      Metric
                    </th>
                    <th className="text-left py-3 px-4">{product1.title}</th>
                    {product2 && (
                      <th className="text-left py-3 px-4">{product2.title}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* 1) TCO (lower better) */}
                  <ComparisonRow
                    label="Cost per km (TCO)"
                    value1={
                      tcoById[product1._id]?.costPerKm
                        ? `₹ ${tcoById[product1._id].costPerKm.toFixed(2)}`
                        : undefined
                    }
                    value2={
                      product2 && tcoById[product2._id]?.costPerKm
                        ? `₹ ${tcoById[product2._id].costPerKm.toFixed(2)}`
                        : undefined
                    }
                    showWinner
                    winnerType="lower"
                    icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
                    highlight
                  />
                  <ComparisonRow
                    label="5-Year TCO (lower is better)"
                    value1={
                      tcoById[product1._id]?.fiveYearTco !== undefined
                        ? formatINR(tcoById[product1._id].fiveYearTco)
                        : undefined
                    }
                    value2={
                      product2 &&
                      tcoById[product2._id]?.fiveYearTco !== undefined
                        ? formatINR(tcoById[product2._id].fiveYearTco)
                        : undefined
                    }
                    showWinner
                    winnerType="lower"
                  />

                  {/* 2) Profit (higher better) */}
                  <ComparisonRow
                    label="Monthly Profit"
                    value1={
                      profitById[product1._id]?.monthlyProfit !== undefined
                        ? formatINR(profitById[product1._id].monthlyProfit)
                        : undefined
                    }
                    value2={
                      product2 &&
                      profitById[product2._id]?.monthlyProfit !== undefined
                        ? formatINR(profitById[product2._id].monthlyProfit)
                        : undefined
                    }
                    showWinner
                    winnerType="higher"
                    icon={<TrendingUp className="w-4 h-4 text-amber-400" />}
                    highlight
                  />
                  <ComparisonRow
                    label="5-Year Profit"
                    value1={
                      profitById[product1._id]?.fiveYearProfit !== undefined
                        ? formatINR(profitById[product1._id].fiveYearProfit)
                        : undefined
                    }
                    value2={
                      product2 &&
                      profitById[product2._id]?.fiveYearProfit !== undefined
                        ? formatINR(profitById[product2._id].fiveYearProfit)
                        : undefined
                    }
                    showWinner
                    winnerType="higher"
                  />

                  {/* 3) Payload (higher better) */}
                  <ComparisonRow
                    label="Payload"
                    value1={product1.specifications?.payload}
                    value2={product2?.specifications?.payload}
                    showWinner
                    winnerType="higher"
                    icon={<Truck className="w-4 h-4 text-blue-400" />}
                    highlight
                  />

                  {/* 4) Monitoring Features */}
                  <tr className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      Monitoring Features
                    </td>
                    <td className="py-4 px-4">
                      <Chips items={product1.monitoringFeatures ?? []} />
                    </td>
                    {product2 && (
                      <td className="py-4 px-4">
                        <Chips items={product2.monitoringFeatures ?? []} />
                      </td>
                    )}
                  </tr>

                  {/* 5) Customer Review (higher rating better) */}
                  {(() => {
                    const r1 = product1.reviews?.avgRating ?? null;
                    const r2 = product2?.reviews?.avgRating ?? null;
                    const v1 =
                      r1 !== null
                        ? `${r1?.toFixed(1)} / 5 (${
                            product1.reviews?.totalReviews ?? 0
                          })`
                        : undefined;
                    const v2 =
                      r2 !== null && product2
                        ? `${r2?.toFixed(1)} / 5 (${
                            product2.reviews?.totalReviews ?? 0
                          })`
                        : undefined;
                    return (
                      <ComparisonRow
                        label="Customer Review"
                        value1={v1}
                        value2={v2}
                        showWinner
                        winnerType="higher"
                        icon={<Star className="w-4 h-4 text-yellow-400" />}
                        highlight
                      />
                    );
                  })()}

                  {/* 6) Engine Power (higher better) */}
                  <ComparisonRow
                    label="Engine Power"
                    value1={product1.specifications?.power}
                    value2={product2?.specifications?.power}
                    showWinner
                    winnerType="higher"
                    icon={<Settings className="w-4 h-4 text-purple-400" />}
                  />

                  {/* 7) Torque (higher better) */}
                  <ComparisonRow
                    label="Torque"
                    value1={product1.specifications?.torque}
                    value2={product2?.specifications?.torque}
                    showWinner
                    winnerType="higher"
                    icon={<Settings className="w-4 h-4 text-fuchsia-400" />}
                  />

                  {/* 8) Transmission Quality */}
                  {(() => {
                    const q1 =
                      product1.transmissionQualityScore ??
                      transmissionQualityHeuristic(
                        product1.specifications?.transmission
                      );
                    const q2 =
                      product2?.transmissionQualityScore ??
                      transmissionQualityHeuristic(
                        product2?.specifications?.transmission
                      ) ??
                      null;

                    const v1 =
                      q1 !== undefined && q1 !== null
                        ? `${q1.toFixed(1)} / 10`
                        : product1.specifications?.transmission ?? undefined;

                    const v2 = product2
                      ? q2 !== null
                        ? `${q2.toFixed(1)} / 10`
                        : product2.specifications?.transmission
                      : undefined;

                    return (
                      <ComparisonRow
                        label="Transmission Quality"
                        value1={v1}
                        value2={v2}
                        showWinner
                        winnerType="higher"
                        icon={<Settings className="w-4 h-4 text-sky-400" />}
                      />
                    );
                  })()}

                  {/* 9) Tyre */}
                  <ComparisonRow
                    label="Tyre"
                    value1={product1.specifications?.tyreSize}
                    value2={product2?.specifications?.tyreSize}
                    icon={<Truck className="w-4 h-4 text-teal-400" />}
                  />

                  {/* 10) Driver Comfort */}
                  {(() => {
                    const c1 =
                      product1.driverComfortScore ??
                      Math.min(10, comfortScoreFromFeatures(product1.features));
                    const c2 = product2
                      ? product2.driverComfortScore ??
                        Math.min(
                          10,
                          comfortScoreFromFeatures(product2.features)
                        )
                      : null;

                    return (
                      <ComparisonRow
                        label="Driver Comfort"
                        value1={`${c1.toFixed(1)} / 10`}
                        value2={
                          product2 && c2 !== null
                            ? `${c2!.toFixed(1)} / 10`
                            : undefined
                        }
                        showWinner
                        winnerType="higher"
                        icon={<Heart className="w-4 h-4 text-rose-400" />}
                        highlight
                      />
                    );
                  })()}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-500 mt-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" /> Better value
              highlighted
            </div>
          </CardContent>
        </Card>

        {/* Best Recommendation */}
        {products.length === 2 && winnerIndex !== -1 && (
          <Card className="border border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 mb-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ThumbsUp className="w-5 h-5 text-white" />
               <span className="text-white">Best Recommendation for Your Inputs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="text-lg text-white font-semibold mb-2">
                    {products[winnerIndex].title}
                  </div>
                  <p className="text-gray-300">
                    Overall score:{" "}
                    <span className="text-green-400 font-semibold">
                      {winnerIndex === 0
                        ? scoreA.toFixed(1)
                        : scoreB.toFixed(1)}
                    </span>{" "}
                    vs{" "}
                    <span className="text-gray-400">
                      {winnerIndex === 0
                        ? scoreB.toFixed(1)
                        : scoreA.toFixed(1)}
                    </span>
                  </p>
                  {topReasons.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-400 mb-2">
                        Why this pick (top factors):
                      </div>
                      <ul className="list-disc list-inside text-sm text-gray-300">
                        {topReasons.map((r, i) => (
                          <li key={i}>
                            {r.label}{" "}
                            <span className="text-gray-500">(+{r.weight})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-stretch md:items-end gap-2">
                  <Link
                    to={`/products/${products[winnerIndex]._id}`}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Recommended Vehicle
                  </Link>
                  <Button
                    onClick={() => proceedToReview(products[winnerIndex])}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
                  >
                    Proceed to Review <MoveRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for other sections (placeholders to keep layout) */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            {
              id: "overview",
              label: "Overview",
              icon: <TrendingUp className="w-4 h-4" />,
            },
            {
              id: "specifications",
              label: "Specifications",
              icon: <Settings className="w-4 h-4" />,
            },
            {
              id: "features",
              label: "Features",
              icon: <Star className="w-4 h-4" />,
            },
            {
              id: "dimensions",
              label: "Dimensions",
              icon: <Truck className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Make Your Decision?
            </h2>
            <p className="text-gray-400">
              Get detailed information, go back to refine, or proceed to review
              & submit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <Button
                key={p._id}
                onClick={() => proceedToReview(p)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Proceed to Review ({p.title.split(" ")[0]}){" "}
                <MoveRight className="w-5 h-5" />
              </Button>
            ))}

            {products.length === 2 && winnerIndex !== -1 && (
              <Button
                onClick={() => proceedToReview(products[winnerIndex])}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
              >
                Proceed with Recommendation <MoveRight className="w-5 h-5" />
              </Button>
            )}

            <Button
              onClick={downloadComparison}
              variant="outline"
              className="border-gray-600 text-black px-6 py-4 rounded-lg transition-all duration-300 hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> Download PDF
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{k}</span>
      <span className="text-white font-medium">{v}</span>
    </div>
  );
}
