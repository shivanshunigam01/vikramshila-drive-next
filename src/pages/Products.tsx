import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/product";
import {
  downloadBrochureService,
  productFind,
} from "@/services/productService";
import { useFilter } from "@/contexts/FilterContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FinanceCalculator from "@/components/home/FinanceCalculator";
import MyCalculator from "@/components/myCalculator";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: string;
}

export default function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { setFilters, isFiltered, clearFilters } = useFilter();
  const location = useLocation();

  // Local dropdown states (not triggering API automatically)
  const [application, setApplication] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [payload, setPayload] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  // Track selected products
  const [selected, setSelected] = useState<string[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initial fetch → get all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const filters: any = {};

        searchParams.forEach((value, key) => {
          filters[key] = value;
        });

        if (Object.keys(filters).length > 0) {
          // ✅ If query params exist → call productFind
          const response = await productFind(filters);
          setProducts(response.data?.data || []);
        } else {
          // ✅ Otherwise → fetch all products
          const data = await getProducts();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]); // 👈 refetch when query params change

  // Apply Filters → Fetch API once
  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      if (
        application !== "All" ||
        fuelType !== "All" ||
        payload !== "All" ||
        priceRange !== "All"
      ) {
        const newFilters = { application, fuelType, payload, priceRange };
        setFilters(newFilters);
        const response = await productFind(newFilters);
        setProducts(response.data?.data || []);
      } else {
        clearFilters();
        const data = await getProducts();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to apply filters:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = async () => {
    setApplication("All");
    setFuelType("All");
    setPayload("All");
    setPriceRange("All");
    clearFilters();
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  // Search filter (client-side)
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkbox select
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Open Finance Calculator modal
  const openCalculator = () => {
    if (selected.length === 1) {
      const product = products.find((p) => p._id === selected[0]);
      if (product) {
        setSelectedProduct(product);
        setShowCalculator(true);
      }
    }
  };

  // Navigate to comparison page
  const handleCompareProducts = () => {
    if (selected.length === 2) {
      const productIds = selected.join(",");
      navigate(`/compare/${productIds}`);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelected([]);
  };
  const handleDownloadBrochure = async (
    productId: string,
    brochureFile?: any
  ) => {
    if (!productId || !brochureFile) {
      alert("Brochure not available");
      return;
    }

    try {
      const response = await downloadBrochureService(productId);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      let filename = "brochure.pdf";
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      } else if (brochureFile?.originalName) {
        filename = brochureFile.originalName;
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Download failed:", err);
      alert(`Download failed: ${err.message}`);
    }
  };
  return (
    <div className="bg-black min-h-screen text-white relative">
      <Helmet>
        <title>Products | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Explore Tata commercial vehicles: SCV, Pickup, LCV, ICV, MCV, Winger & Buses."
        />
        <link rel="canonical" href="/products" />
      </Helmet>

      <Header />

      {/* Breadcrumb */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-400">
            <a href="/" className="hover:text-white">
              Home
            </a>
            <span className="mx-2">›</span>
            <span className="text-white">All Vehicles</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-72 bg-black rounded-lg border border-gray-800 h-fit p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={handleResetFilters}
                className="text-blue-500 text-sm hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search vehicles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dropdowns */}
            <div className="space-y-5">
              {/* Application */}
              <div className="relative">
                <select
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  className="appearance-none w-full bg-black border border-gray-700 px-4 py-3 rounded text-white focus:ring-2 focus:ring-blue-500 pr-10"
                >
                  <option value="All">Choose Application</option>
                  <option value="Fruits & Vegetables">
                    Fruits & Vegetables
                  </option>
                  <option value="Food Grain">Food Grain</option>
                  <option value="Cement bags">Cement Bags</option>
                  <option value="LPG">LPG</option>
                  <option value="Milk">Milk</option>
                  <option value="Fish">Fish</option>
                  <option value="Market Load">Market Load</option>
                  <option value="Animal husbandry">Animal Husbandry</option>
                  <option value="Poultry">Poultry</option>
                  <option value="Logistics">Logistics</option>
                  <option value="FMCG">FMCG</option>
                  <option value="Refrigrated Van">Refrigerated Van</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>
              </div>

              {/* Fuel Type */}
              <div className="relative">
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="appearance-none w-full bg-black border border-gray-700 px-4 py-3 rounded text-white focus:ring-2 focus:ring-blue-500 pr-10"
                >
                  <option value="All">Choose Fuel Type</option>
                  <option value="cng">CNG</option>
                  <option value="diesel">Diesel</option>
                  <option value="petrol">Petrol</option>
                  <option value="cng_petrol">CNG+Petrol</option>
                  <option value="electric">Electric</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>
              </div>

              {/* Payload */}
              <div className="relative">
                <select
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="appearance-none w-full bg-black border border-gray-700 px-4 py-3 rounded text-white focus:ring-2 focus:ring-blue-500 pr-10"
                >
                  <option value="All">Choose Payload</option>
                  <option value="500-750">500 - 750 Kg</option>
                  <option value="750-1500">750 - 1500 Kg</option>
                  <option value="1500-3000">1500 - 3000 Kg</option>
                  <option value="3000-6000">3000 - 6000 Kg</option>
                  <option value="6000+">6000 Kg +</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>
              </div>

              {/* Price Range */}
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="appearance-none w-full bg-black border border-gray-700 px-4 py-3 rounded text-white focus:ring-2 focus:ring-blue-500 pr-10"
                >
                  <option value="All">Vehicle Price Range</option>
                  <option value="5-15L">5 - 15 Lakhs</option>
                  <option value="15-20L">15 - 20 Lakhs</option>
                  <option value="20-25L">20 - 25 Lakhs</option>
                  <option value="25-30L">25 - 30 Lakhs</option>
                  <option value="30L+">30 Lakhs +</option>
                </select>

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>
              </div>
            </div>

            {/* Apply Filters */}
            <Button
              onClick={handleApplyFilters}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>

            {/* Selection Info */}
            {selected.length > 0 && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {selected.length} product{selected.length > 1 ? "s" : ""}{" "}
                    selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-red-400 text-sm hover:underline"
                  >
                    Clear
                  </button>
                </div>
                {selected.length === 2 && (
                  <p className="text-xs text-gray-400">
                    Ready to compare! Use the compare button.
                  </p>
                )}
                {selected.length > 2 && (
                  <p className="text-xs text-red-400">
                    Maximum 2 products can be compared.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
                <p className="text-gray-400 text-sm">
                  {isFiltered
                    ? "Try adjusting your filters"
                    : "No products available"}
                </p>
                {isFiltered && (
                  <Button
                    onClick={handleResetFilters}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View All
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((v) => (
                  <Card
                    key={v._id}
                    className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group relative"
                  >
                    {/* Checkbox top-right */}
                    <div className="absolute top-3 right-3 z-10">
                      <input
                        type="checkbox"
                        checked={selected.includes(v._id)}
                        onChange={() => toggleSelect(v._id)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                        disabled={
                          !selected.includes(v._id) && selected.length >= 2
                        }
                      />
                    </div>

                    <CardHeader className="p-0">
                      <div className="aspect-[4/3] bg-black overflow-hidden">
                        <img
                          src={v.images?.[0]}
                          alt={v.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 flex flex-col">
                      <CardTitle className="text-lg font-semibold text-white mb-3">
                        {v.title}
                      </CardTitle>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {v.description}
                      </p>

                      <div className="flex justify-between text-sm text-gray-300 mb-4 border-t border-gray-700 pt-4">
                        <div>
                          <p className="font-semibold">{v.price}</p>
                          <p className="text-xs">Price</p>
                        </div>
                        <div>
                          <p className="font-semibold">{v.category}</p>
                          <p className="text-xs">Category</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Link
                          to={`/products/${v._id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-center"
                        >
                          Know More
                        </Link>
                        {v.brochureFile && (
                          <button
                            onClick={() =>
                              handleDownloadBrochure(v._id, v.brochureFile)
                            }
                            className="flex items-center justify-center w-11 h-11 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white"
                          >
                            PDF
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Conditional Buttons */}
      {selected.length > 0 && (
        <div className="z-50">
          {selected.length === 1 && (
            <Button
              onClick={openCalculator}
              className="fixed top-1/2 right-0 -translate-y-1/2 z-40 
                bg-blue-600 hover:bg-blue-700 text-white 
                px-4 py-2 rounded-l-lg shadow-lg 
                [writing-mode:vertical-rl] rotate-180 
                flex justify-center items-center w-12 h-40"
            >
              Choose this Vehicle
            </Button>
          )}

          {selected.length === 2 && (
            <Button
              onClick={handleCompareProducts}
              className="fixed top-1/2 right-0 -translate-y-1/2 z-40 
                bg-green-600 hover:bg-green-700 text-white 
                px-4 py-2 rounded-l-lg shadow-lg 
                [writing-mode:vertical-rl] rotate-180 
                flex justify-center items-center w-12 h-40"
            >
              Compare Products
            </Button>
          )}

          {selected.length > 2 && (
            <div
              className="fixed top-1/2 right-0 -translate-y-1/2 z-40 
                bg-red-600 text-white px-4 py-2 rounded-l-lg shadow-lg 
                text-sm [writing-mode:vertical-rl] rotate-180 
                flex justify-center items-center w-12 h-48 whitespace-nowrap"
            >
              Only 2 Products Allowed
            </div>
          )}
        </div>
      )}

      {/* Finance Calculator Modal */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-3xl bg-black text-white">
          <DialogHeader>
            <DialogTitle>Finance Calculator</DialogTitle>
          </DialogHeader>
          <MyCalculator
            initialPrice={
              selectedProduct?.price
                ? parseInt(selectedProduct.price, 10)
                : 599000
            }
            selectedProduct={selectedProduct}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
