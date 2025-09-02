import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  ShoppingCart,
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
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
}

export default function ProductComparison() {
  const { productIds } = useParams<{ productIds: string }>();
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
      } catch (error) {
        console.log("Error sharing:", error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  const downloadComparison = () => {
    window.print();
  };

  const getWinner = (
    value1: string | undefined,
    value2: string | undefined,
    type: "higher" | "lower" = "higher"
  ) => {
    if (!value1 || !value2) return null;

    const num1 = parseFloat(value1.replace(/[^\d.]/g, ""));
    const num2 = parseFloat(value2.replace(/[^\d.]/g, ""));

    if (isNaN(num1) || isNaN(num2)) return null;

    if (type === "higher") {
      return num1 > num2 ? "product1" : num2 > num1 ? "product2" : null;
    } else {
      return num1 < num2 ? "product1" : num2 < num1 ? "product2" : null;
    }
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
              {products.length} product{products.length !== 1 ? "s" : ""}{" "}
              selected.
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
    value1: string | undefined;
    value2: string | undefined;
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

  // Get all unique features from both products
  const allFeatures = Array.from(
    new Set([...(product1.features || []), ...(product2.features || [])])
  );

  // Calculate feature score for each product
  const getFeatureScore = (product: Product) => {
    const totalFeatures = allFeatures.length;
    const productFeatures = product.features?.length || 0;
    return Math.round((productFeatures / totalFeatures) * 100);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>{`Compare ${product1.title} vs ${product2.title} | Vikramshila Automobiles`}</title>
        <meta
          name="description"
          content={`Detailed comparison between ${product1.title} and ${product2.title}. Compare specifications, features, and prices.`}
        />
      </Helmet>

      <Header />

      {/* Enhanced Breadcrumb with Actions */}
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
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                {comparisonMode === "detailed" ? "Simplified" : "Detailed"}
              </Button>
              <Button
                onClick={shareComparison}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Link
                to="/products"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Product Comparison
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Make an informed decision by comparing features, specifications, and
            pricing side by side
          </p>
        </div>

        {/* Enhanced Product Headers with Quick Stats */}
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
                    {index === 0 && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Product A
                      </span>
                    )}
                    {index === 1 && (
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                        Product B
                      </span>
                    )}
                  </CardTitle>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Quick Stats */}
                {/* <div className="grid grid-cols-2 gap-4 mb-4"> */}
                {/* <div className="text-center p-3 bg-gray-800/50 rounded-lg"> */}
                {/* <div className="text-2xl font-bold text-blue-400">
                      {getFeatureScore(product)}%
                    </div>
                    <div className="text-xs text-gray-400">Feature Score</div> */}
                {/* </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      {product.features?.length || 0}
                    </div> */}
                {/* <div className="text-xs text-gray-400">Features</div> */}
                {/* </div> */}
                {/* </div> */}

                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    {product.price}
                  </div>
                  <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/products/${product._id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  {/* <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
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

        {/* Comparison Tables */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Quick Winner Analysis */}
              {/* <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    Quick Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {Math.max(
                          getFeatureScore(product1),
                          getFeatureScore(product2)
                        )}
                        %
                      </div>
                      <div className="text-sm text-gray-300">
                        Best Feature Score
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {getFeatureScore(product1) > getFeatureScore(product2)
                          ? product1.title
                          : product2.title}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {Math.max(
                          product1.features?.length || 0,
                          product2.features?.length || 0
                        )}
                      </div>
                      <div className="text-sm text-gray-300">Most Features</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {(product1.features?.length || 0) >
                        (product2.features?.length || 0)
                          ? product1.title
                          : product2.title}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        {allFeatures.length}
                      </div>
                      <div className="text-sm text-gray-300">
                        Total Features
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Combined comparison
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              {/* Basic Information */}
              <Card className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="w-6 h-6 text-blue-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                        <tr>
                          <th className="py-4 px-4 text-left text-gray-300 font-medium">
                            Specification
                          </th>
                          <th className="py-4 px-4 text-left text-gray-300 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                              {product1.title}
                            </div>
                          </th>
                          <th className="py-4 px-4 text-left text-gray-300 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                              {product2.title}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <ComparisonRow
                          label="Price"
                          value1={product1.price}
                          value2={product2.price}
                          highlight
                          showWinner={true}
                          winnerType="lower"
                        />
                        <ComparisonRow
                          label="Category"
                          value1={product1.category}
                          value2={product2.category}
                        />
                        <ComparisonRow
                          label="Description"
                          value1={product1.description}
                          value2={product2.description}
                        />
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Specifications Tab */}
          {activeTab === "specifications" &&
            (product1.specifications || product2.specifications) && (
              <>
                {/* Engine Specifications */}
                <Card className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="w-6 h-6 text-orange-500" />
                      Engine & Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                          <tr>
                            <th className="py-4 px-4 text-left text-gray-300 font-medium">
                              Specification
                            </th>
                            <th className="py-4 px-4 text-left text-gray-300 font-medium">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                {product1.title}
                              </div>
                            </th>
                            <th className="py-4 px-4 text-left text-gray-300 font-medium">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                                {product2.title}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <ComparisonRow
                            label="Engine"
                            value1={product1.specifications?.engine}
                            value2={product2.specifications?.engine}
                            icon={
                              <Settings className="w-4 h-4 text-gray-400" />
                            }
                          />
                          <ComparisonRow
                            label="Power"
                            value1={product1.specifications?.power}
                            value2={product2.specifications?.power}
                            highlight
                            showWinner={true}
                            icon={<Zap className="w-4 h-4 text-orange-400" />}
                          />
                          <ComparisonRow
                            label="Torque"
                            value1={product1.specifications?.torque}
                            value2={product2.specifications?.torque}
                            showWinner={true}
                            icon={
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            }
                          />
                          <ComparisonRow
                            label="Fuel Type"
                            value1={product1.specifications?.fuelType}
                            value2={product2.specifications?.fuelType}
                            highlight
                          />
                          <ComparisonRow
                            label="Transmission"
                            value1={product1.specifications?.transmission}
                            value2={product2.specifications?.transmission}
                          />
                          <ComparisonRow
                            label="Fuel Capacity"
                            value1={product1.specifications?.fuelCapacity}
                            value2={product2.specifications?.fuelCapacity}
                            highlight
                            showWinner={true}
                          />
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Load & Capacity */}
                <Card className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Truck className="w-6 h-6 text-green-500" />
                      Load & Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                          <tr>
                            <th className="py-4 px-4 text-left text-gray-300 font-medium">
                              Specification
                            </th>
                            <th className="py-4 px-4 text-left text-gray-300 font-medium">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                {product1.title}
                              </div>
                            </th>
                            <th className="py-4 px-4 text-left text-gray-300 font-medium">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                                {product2.title}
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <ComparisonRow
                            label="Payload"
                            value1={product1.specifications?.payload}
                            value2={product2.specifications?.payload}
                            highlight
                            showWinner={true}
                          />
                          <ComparisonRow
                            label="GVW (Gross Vehicle Weight)"
                            value1={product1.specifications?.gvw}
                            value2={product2.specifications?.gvw}
                            showWinner={true}
                          />
                          <ComparisonRow
                            label="Wheelbase"
                            value1={product1.specifications?.wheelbase}
                            value2={product2.specifications?.wheelbase}
                            highlight
                          />
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

          {/* Features Tab */}
          {activeTab === "features" && allFeatures.length > 0 && (
            <Card className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Features Comparison
                </CardTitle>
                <div className="text-sm text-gray-400">
                  {allFeatures.length} total features •{" "}
                  {product1.features?.length || 0} vs{" "}
                  {product2.features?.length || 0}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                      <tr>
                        <th className="py-4 px-4 text-left text-gray-300 font-medium">
                          Feature
                        </th>
                        <th className="py-4 px-4 text-center text-gray-300 font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            {product1.title}
                          </div>
                        </th>
                        <th className="py-4 px-4 text-center text-gray-300 font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                            {product2.title}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFeatures.map((feature, index) => (
                        <FeatureComparison
                          key={index}
                          feature={feature}
                          product1Features={product1.features || []}
                          product2Features={product2.features || []}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dimensions Tab */}
          {activeTab === "dimensions" &&
            (product1.dimensions || product2.dimensions) && (
              <Card className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Truck className="w-6 h-6 text-purple-500" />
                    Dimensions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                        <tr>
                          <th className="py-4 px-4 text-left text-gray-300 font-medium">
                            Dimension
                          </th>
                          <th className="py-4 px-4 text-left text-gray-300 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                              {product1.title}
                            </div>
                          </th>
                          <th className="py-4 px-4 text-left text-gray-300 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                              {product2.title}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <ComparisonRow
                          label="Length"
                          value1={product1.dimensions?.length}
                          value2={product2.dimensions?.length}
                          showWinner={true}
                        />
                        <ComparisonRow
                          label="Width"
                          value1={product1.dimensions?.width}
                          value2={product2.dimensions?.width}
                          highlight
                          showWinner={true}
                        />
                        <ComparisonRow
                          label="Height"
                          value1={product1.dimensions?.height}
                          value2={product2.dimensions?.height}
                          showWinner={true}
                        />
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Enhanced Action Buttons */}
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
              <Eye className="w-5 h-5" />
              View {product1.title.split(" ")[0]} Details
            </Link>
            <Link
              to={`/products/${product2._id}`}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View {product2.title.split(" ")[0]} Details
            </Link>
            <Button
              onClick={downloadComparison}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
            <Button
              onClick={shareComparison}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/25 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Comparison
            </Button>
          </div>
        </div>

        {/* Recommendation Section */}
        {/* <div className="mt-16">
          <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Award className="w-8 h-8 text-yellow-500" />
                Our Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {(() => {
                  const score1 = getFeatureScore(product1);
                  const score2 = getFeatureScore(product2);
                  const winner =
                    score1 > score2
                      ? product1
                      : score2 > score1
                      ? product2
                      : null;

                  if (winner) {
                    return (
                      <div className="max-w-2xl mx-auto">
                        <div className="text-3xl font-bold text-green-400 mb-4">
                          {winner.title}
                        </div>
                        <p className="text-gray-300 mb-6">
                          Based on feature comparison, {winner.title} scores
                          higher with {Math.max(score1, score2)}% feature
                          coverage and {winner.features?.length || 0} total
                          features.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            to={`/products/${winner._id}`}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Star className="w-5 h-5" />
                            View Recommended Product
                          </Link>
                          <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <Heart className="w-5 h-5" />
                            Save to Favorites
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="max-w-2xl mx-auto">
                        <div className="text-2xl font-bold text-yellow-400 mb-4">
                          Both Products Are Equally Matched
                        </div>
                        <p className="text-gray-300 mb-6">
                          Both products have similar feature scores ({score1}%
                          vs {score2}%). Consider your specific needs, budget,
                          and intended use case to make the best choice.
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-4 text-left">
                          <h4 className="font-semibold text-white mb-2">
                            Consider These Factors:
                          </h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Your budget and financing options</li>
                            <li>
                              • Intended use (city driving vs highway vs
                              heavy-duty)
                            </li>
                            <li>• Fuel efficiency requirements</li>
                            <li>
                              • After-sales service availability in your area
                            </li>
                            <li>• Resale value considerations</li>
                          </ul>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Still Undecided?</h2>
            <p className="text-gray-400">
              Compare with other products or explore our full range
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5" />
              Browse All Products
            </Link>
            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Get Expert Advice
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          .container {
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }

          .bg-black,
          .bg-gray-900,
          .bg-gray-800 {
            background: white !important;
            color: black !important;
          }

          .text-white,
          .text-gray-300,
          .text-gray-400 {
            color: black !important;
          }

          .border-gray-800,
          .border-gray-700 {
            border-color: #ccc !important;
          }

          table {
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #ccc !important;
            padding: 8px !important;
          }

          .shadow-lg,
          .shadow-2xl {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
