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
import { Search, Download, Filter } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { getProducts } from "@/services/product";
import {
  downloadBrochureService,
  productFind,
  applicationFind,
} from "@/services/productService";
import { useFilter } from "@/contexts/FilterContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FinanceCalculator from "@/components/home/FinanceCalculator";
import MyCalculator from "@/components/myCalculator";

interface Product {
  gvw: ReactNode;
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: string;
  tonnage?: string;
  fuelTankCapacity?: string;
  gradeability?: string;
  application?: string;
  fuelType?: string;
  payload?: string;
  priceRange?: string;
}

interface FilterState {
  application: string;
  fuelType: string;
  payload: string;
  priceRange: string;
}

export default function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<string[]>([]);

  const { setFilters, isFiltered, clearFilters } = useFilter();
  const location = useLocation();

  // Local dropdown states (not triggering API automatically)
  const [application, setApplication] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [payload, setPayload] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Track selected products
  const [selected, setSelected] = useState<string[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationFind({});
        if (res.data.success && Array.isArray(res.data.data)) {
          setApplications(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const filters: any = {};

        if (
          searchParams.get("application") &&
          searchParams.get("application") !== "all"
        ) {
          filters.application = searchParams.get("application");
          setApplication(searchParams.get("application") || "all");
        }
        if (
          searchParams.get("fuelType") &&
          searchParams.get("fuelType") !== "all"
        ) {
          filters.fuelType = searchParams.get("fuelType");
          setFuelType(searchParams.get("fuelType") || "all");
        }
        if (
          searchParams.get("payload") &&
          searchParams.get("payload") !== "all"
        ) {
          filters.payload = searchParams.get("payload");
          setPayload(searchParams.get("payload") || "all");
        }
        if (
          searchParams.get("priceRange") &&
          searchParams.get("priceRange") !== "all"
        ) {
          filters.priceRange = searchParams.get("priceRange");
          setPriceRange(searchParams.get("priceRange") || "all");
        }

        if (Object.keys(filters).length > 0) {
          const response = await productFind(filters);
          setProducts(response.data?.data || []);
          setFilters(filters); // ✅ safe inside effect body
        } else {
          const data = await getProducts();
          setProducts(data);
          clearFilters(); // reset when no filters
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]); // ✅ removed setFilters

  // Apply Filters → Fetch API once
  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      if (
        application !== "all" ||
        fuelType !== "all" ||
        payload !== "all" ||
        priceRange !== "all"
      ) {
        const filterParams: FilterState = {
          application,
          fuelType,
          payload,
          priceRange,
        };

        setFilters(filterParams);

        // Update URL with filters
        const searchParams = new URLSearchParams({
          application: String(application),
          fuelType: String(fuelType),
          payload: String(payload),
          priceRange: String(priceRange),
        });
        navigate(`/products?${searchParams.toString()}`, { replace: true });

        const response = await productFind(filterParams);
        setProducts(response.data?.data || []);
      } else {
        clearFilters();
        navigate("/products", { replace: true });
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

  // Reset filters → Navigate to clean URL
  const handleResetFilters = () => {
    // Reset local state
    setApplication("all");
    setFuelType("all");
    setPayload("all");
    setPriceRange("all");
    setSearchTerm("");

    // Navigate to clean URL - useEffect will handle loading all products
    navigate("/products", { replace: true });
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

    setDownloadingId(productId); // show loader for this product
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
    } finally {
      setDownloadingId(null); // hide loader after response
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
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="text-white">All Vehicles</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {/* Sidebar Filters */}
          <div className="w-80 md:w-96 bg-black rounded-lg border border-gray-800 p-6 flex flex-col">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-500" />
                  <h2 className="text-base font-semibold">Filters</h2>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-blue-500 text-xs hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vehicles"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-700 rounded-md bg-black text-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Dropdowns */}
              <div className="space-y-3 text-sm">
                {/* Application Dropdown */}
                <div className="relative">
                  <select
                    value={application}
                    onChange={(e) => setApplication(e.target.value)}
                    className="appearance-none w-full bg-black border border-gray-700 px-3 py-2 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  >
                    <option value="all">Application</option>
                    {applications.map((app, idx) => (
                      <option key={idx} value={app}>
                        {app}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>

                {/* Fuel Type Dropdown */}
                <div className="relative">
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="appearance-none w-full bg-black border border-gray-700 px-3 py-2 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  >
                    <option value="All">Choose Fuel Type</option>
                    <option value="cng">CNG</option>
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="cng_petrol">CNG+Petrol</option>
                    <option value="electric">Electric</option>
                    {/* Add more fuel types if needed */}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>

                {/* Payload Dropdown */}
                <div className="relative">
                  <select
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    className="appearance-none w-full bg-black border border-gray-700 px-3 py-2 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  >
                    <option value="All">Choose Payload</option>
                    <option value="500-750">500 - 750 Kg</option>
                    <option value="750-1500">750 - 1500 Kg</option>
                    <option value="1500-3000">1500 - 3000 Kg</option>
                    <option value="3000-6000">3000 - 6000 Kg</option>
                    <option value="6000+">6000 Kg +</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>

                {/* Price Range Dropdown */}
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="appearance-none w-full bg-black border border-gray-700 px-3 py-2 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  >
                    <option value="All">Vehicle Price Range</option>
                    <option value="5-15L">5 - 15 Lakhs</option>
                    <option value="15-20L">15 - 20 Lakhs</option>
                    <option value="20-25L">20 - 25 Lakhs</option>
                    <option value="25-30L">25 - 30 Lakhs</option>
                    <option value="30L+">30 Lakhs +</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>
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
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {isFiltered ? "Filtered Results" : "All Vehicles"}
              </h1>
              <p className="text-gray-400">
                {filteredProducts.length} vehicle
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400">Loading vehicles...</span>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-900 rounded-lg border border-gray-800">
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {searchTerm
                      ? `No results for "${searchTerm}"`
                      : isFiltered
                      ? "Try adjusting your filters"
                      : "No products available"}
                  </p>
                  <div className="flex gap-3 justify-center">
                    {searchTerm && (
                      <Button
                        onClick={() => setSearchTerm("")}
                        variant="outline"
                        className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
                      >
                        Clear Search
                      </Button>
                    )}
                    {isFiltered && (
                      <Button
                        onClick={handleResetFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View All Vehicles
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((v) => (
                  <Card
                    key={v._id}
                    className="bg-black border border-gray-800 rounded-lg overflow-hidden group relative w-[280px] md:w-[300px]"
                  >
                    {/* ✅ Checkbox Row (above the image, not overlapping) */}
                    <div className="flex items-center justify-end space-x-2 px-3 pt-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(v._id)}
                        onChange={() => toggleSelect(v._id)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                        disabled={
                          !selected.includes(v._id) && selected.length >= 2
                        }
                      />{" "}
                      <label
                        htmlFor={`compare-${v._id}`}
                        className="text-sm text-white cursor-pointer"
                      >
                        Compare
                      </label>
                    </div>

                    {/* Product Image */}
                    <CardHeader className="p-0 bg-black">
                      <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-black">
                        <img
                          src={v.images?.[0]}
                          alt={v.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>

                    {/* Product Content */}
                    <CardContent className="p-4 flex flex-col bg-black text-white">
                      {/* Title */}
                      <CardTitle className="text-lg font-semibold mb-3 text-white">
                        {v.title}
                      </CardTitle>

                      {/* Specs row */}
                      <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-300 mb-4">
                        <div>
                          <p className="font-bold text-white">{v.gvw}</p>
                          <p className="text-xs text-gray-400">Tonnage (GVW)</p>
                        </div>
                        <div>
                          <p className="font-bold text-white">
                            {v.fuelTankCapacity}
                          </p>
                          <p className="text-xs text-gray-400">Fuel Tank</p>
                        </div>
                        <div>
                          <p className="font-bold text-white">{v.payload}</p>
                          <p className="text-xs text-gray-400">Payload</p>
                        </div>
                      </div>

                      {/* Buttons */}
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
