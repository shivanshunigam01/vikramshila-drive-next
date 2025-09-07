// src/pages/Compare.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
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
  Zap,
  Shield,
  Truck,
  Settings,
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
    power?: string;
    torque?: string;
    fuelCapacity?: string;
    payload?: string;
    gvw?: string;
    wheelbase?: string;
    fuelType?: string;
    transmission?: string;
    tyreSize?: string;
  };
  features?: string[];
  dimensions?: { length?: string; width?: string; height?: string };
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

function formatINR(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function ProductComparison() {
  const { productIds } = useParams<{ productIds: string }>();
  const location = useLocation();
  const { tcoResults } = (location.state || {}) as { tcoResults?: TcoResult[] };

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

  if (products.length !== 2) {
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
              Please select exactly 2 products to compare. You currently have{" "}
              {products.length} product
              {products.length !== 1 ? "s" : ""} selected.
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

  const [product1, product2] = products;

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
    new Set([...(product1.features || []), ...(product2.features || [])])
  );
  const getFeatureScore = (p: Product) => {
    const total = allFeatures.length || 1;
    const mine = p.features?.length || 0;
    return Math.round((mine / total) * 100);
  };

  // TCO mapping
  const tcoById: Record<string, TcoResult> = (tcoResults || []).reduce(
    (acc, r) => {
      acc[r.productId] = r;
      return acc;
    },
    {} as Record<string, TcoResult>
  );

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>{`Compare ${product1.title} vs ${product2.title} | Vikramshila Automobiles`}</title>
        <meta
          name="description"
          content={`Detailed comparison between ${product1.title} and ${product2.title}. Compare specifications, features, prices and TCO.`}
        />
      </Helmet>

      <Header />

      {/* Breadcrumb + actions */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link
                to="/products"
                className="hover:text-white transition-colors"
              >
                Products
              </Link>
              <span className="mx-2">›</span>
              <span className="text-white">Compare</span>
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
              {/* <Link
                to="/products"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Products
              </Link> */}
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
            Compare features, specifications, price and ownership costs side by
            side
          </p>
        </div>

        {/* Product headers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {product.title}
                    {tcoById[product._id] && (
                      <span className="text-[10px] uppercase tracking-wide bg-green-600/20 text-green-400 border border-green-600/40 px-2 py-1 rounded">
                        TCO set
                      </span>
                    )}
                    {index === 0 ? (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Product A
                      </span>
                    ) : (
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                        Product B
                      </span>
                    )}
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TCO Summary (if provided) */}
        {tcoResults && tcoResults.length === 2 && (
          <Card className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-600/30 mb-10">
            <CardHeader>
              <CardTitle className="text-xl">
                TCO Summary (from your inputs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
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
                        {t.inputs.mileage} km/l, fuel{" "}
                        {formatINR(t.inputs.fuelPrice)} per litre, insurance{" "}
                        {formatINR(t.inputs.insuranceYear)}/yr, tyres{" "}
                        {formatINR(t.inputs.tyresCost)} set /{" "}
                        {t.inputs.tyreLife} km, resale {t.inputs.resalePct5yr}%.
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Tabs */}
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

        {/* ... keep your existing tables/content here ... */}
        {/* (No change needed below this point other than where you choose to also show TCO fields if you want) */}

        {/* Bottom actions */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Make Your Decision?
            </h2>
            <p className="text-gray-400">
              Get detailed information or save your comparison for later
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to={`/products/${product1._id}`}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" /> View {product1.title.split(" ")[0]}{" "}
              Details
            </Link>
            <Link
              to={`/products/${product2._id}`}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" /> View {product2.title.split(" ")[0]}{" "}
              Details
            </Link>
            <Button
              onClick={downloadComparison}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" /> Download PDF
            </Button>
            <Button
              onClick={shareComparison}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" /> Share Comparison
            </Button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Print styles unchanged */}
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
