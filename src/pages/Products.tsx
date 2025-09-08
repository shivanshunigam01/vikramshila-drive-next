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
import { Search, Filter } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getProducts } from "@/services/product";
import {
  downloadBrochureService,
  productFind,
  applicationFind,
} from "@/services/productService";
import { useFilter } from "@/contexts/FilterContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

import TcoCalculator, { TcoResult, TcoInput } from "@/components/TcoCalculator";
import ProfitCalculator, {
  ProfitInput,
  ProfitResult,
} from "@/components/ProfitCalculator";
import MyCalculator from "@/components/myCalculator";

interface Product {
  gvw: ReactNode;
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: any;
  tonnage?: string;
  fuelTankCapacity?: string;
  gradeability?: string;
  application?: string;
  fuelType?: string;
  payload?: string; // e.g., "2000 Kg"
  priceRange?: string;

  // optional backend fields used by TCO
  mileage?: string; // e.g. "6 km/l"
  tyreLife?: string; // e.g. "60000 km"
  tyresCost?: string | number; // e.g. "60000"
  freightRate?: string; // e.g. "28"
}

interface FilterState {
  application: string;
  fuelType: string;
  payload: string;
  priceRange: string;
}

function numOnly(v?: string | number) {
  if (v == null) return NaN;
  if (typeof v === "number") return v;
  const cleaned = String(v).replace(/[,₹\s]/g, "");
  const m = cleaned.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
}
function kmNumber(s?: string) {
  return numOnly(s);
}
function toTons(payloadStr?: string): number {
  if (!payloadStr) return 1;
  const n = parseFloat(String(payloadStr).replace(/[^\d.]/g, ""));
  if (!isFinite(n) || n <= 0) return 1;
  // assume if value > 100 it is kg; else already tons
  return n > 100 ? n / 1000 : n;
}

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<string[]>([]);

  const { setFilters, isFiltered, clearFilters } = useFilter();

  // Local dropdown states
  const [application, setApplication] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [payload, setPayload] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Selection / modals
  const [selected, setSelected] = useState<string[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // TCO modal (opens after Finance)
  const [showTco, setShowTco] = useState(false);
  const [tcoInitialInputs, setTcoInitialInputs] = useState<TcoInput[] | null>(
    null
  );
  const [lastTcoResults, setLastTcoResults] = useState<TcoResult[] | null>(
    null
  );

  // Profit modal (opens after TCO)
  const [showProfit, setShowProfit] = useState(false);
  const [profitInitialInputs, setProfitInitialInputs] = useState<
    ProfitInput[] | null
  >(null);

  // Keep the two selected Product objects handy
  const selectedProducts = useMemo(
    () => products.filter((p) => selected.includes(p._id)).slice(0, 2),
    [selected, products]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Applications
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

  // Fetch products (and optionally restore modal state when returning from Compare)
  useEffect(() => {
    const fetchProductsAsync = async () => {
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
          setFilters(filters);
        } else {
          const data = await getProducts();
          setProducts(data);
          clearFilters();
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAsync();
  }, [location.search]);

  // Reopen flow when coming "Back" from Compare (Compare navigates with state)
  useEffect(() => {
    const s = location.state as
      | {
          reopen?: "profit" | "tco" | "finance";
          selectedIds?: string[];
          tcoResults?: TcoResult[];
          profitResults?: ProfitResult[]; // <-- accept profit results too
        }
      | undefined;

    if (!s) return;

    if (s.selectedIds?.length) setSelected(s.selectedIds);

    if (s.tcoResults) {
      setLastTcoResults(s.tcoResults);
      setTcoInputsFromResults(s.tcoResults);
    }

    // If profit results are provided, seed Profit inputs *first*,
    // then open the modal so it renders fully populated.
    if (s.reopen === "profit") {
      if (s.profitResults?.length) {
        setProfitInitialInputs(s.profitResults.map((r) => r.inputs));
        // ensure we have the same selected product objects
        // (wait until products are loaded and selectedProducts resolves)
        const waitAndOpen = setInterval(() => {
          const ready =
            selectedProducts.length > 0 &&
            (!!profitInitialInputs ||
              s.profitResults?.length === selectedProducts.length);
          if (ready) {
            setShowProfit(true);
            clearInterval(waitAndOpen);
          }
        }, 0);
      } else {
        // fallback: seed from TCO and then open
        const inputs = makeProfitSeedsFromTco(
          products.filter((p) => s.selectedIds?.includes(p._id)) as Product[],
          s.tcoResults || lastTcoResults || []
        );
        setProfitInitialInputs(inputs);
        setShowProfit(true);
      }
    } else if (s.reopen === "tco") {
      setShowTco(true);
    } else if (s.reopen === "finance") {
      setShowCalculator(true);
    }

    // clean the state
    if (s.reopen) {
      navigate(location.pathname + location.search, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);
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

  const handleResetFilters = () => {
    setApplication("all");
    setFuelType("all");
    setPayload("all");
    setPriceRange("all");
    setSearchTerm("");
    navigate("/products", { replace: true });
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Single-product flow → open Finance for that one product
  const openCalculator = () => {
    if (selected.length === 1) {
      const product = products.find((p) => p._id === selected[0]);
      if (product) {
        setSelectedProduct(product);
        setShowCalculator(true);
      }
    }
  };

  // TWO-product flow → open Finance FIRST
  const handleCompareProducts = () => {
    if (selected.length === 2) {
      setSelectedProduct(null); // not used in 2-product mode
      setShowCalculator(true);
    }
  };

  // Finance done callback (from MyCalculator) → seed TCO for BOTH products
  const handleFinanceDone = ({
    financeData,
  }: {
    financeData: {
      vehiclePrice: number;
      downPaymentPercentage: number;
      downPaymentAmount: number;
      tenure: number; // months
      interestRate: number;
      loanAmount: number;
      estimatedEMI: number;
    };
  }) => {
    // Seed each product’s TCO using SAME finance assumptions, but product-specific price
    const pct = financeData.downPaymentPercentage / 100;
    const tenureYears = Math.max(1, Math.round(financeData.tenure / 12));

    const inputs: TcoInput[] = selectedProducts.map((p) => {
      const price = numOnly(p.price) || 0;
      const down = Math.round(price * pct);
      const loan = Math.max(price - down, 0);

      return {
        vehiclePrice: price,
        loanAmount: loan,
        interestRate: financeData.interestRate,
        tenureYears,
        downPayment: down,
        monthlyRunning: 3000,
        mileage: kmNumber(p.mileage) || 0,
        fuelPrice: 95,
        monthlyMaintenance: 2500,
        insuranceYear: 40000,
        tyresCost: numOnly(p.tyresCost) || 0,
        tyreLife: kmNumber(p.tyreLife) || 0,
        resalePct5yr: 25,
      };
    });

    setTcoInitialInputs(inputs);
    setShowCalculator(false);
    setShowTco(true);
  };

  const handleTcoBack = () => {
    // Back to Finance
    setShowTco(false);
    setShowCalculator(true);
  };

  const setTcoInputsFromResults = (results?: TcoResult[] | null) => {
    if (!results || !results.length) return;
    setTcoInitialInputs(results.map((r) => r.inputs));
  };
  const handleProfitBack = () => {
    // restore TCO form exactly as it was when you clicked Continue
    setTcoInputsFromResults(lastTcoResults);
    setShowProfit(false);
    setShowTco(true);
  };
  const handleTcoDone = (results: TcoResult[]) => {
    // Store TCO results and open Profit Calculator with seeded inputs
    setLastTcoResults(results);

    const inputs: ProfitInput[] = makeProfitSeedsFromTco(
      selectedProducts,
      results
    );
    setProfitInitialInputs(inputs);
    setShowTco(false);
    setShowProfit(true);
  };

  function makeProfitSeedsFromTco(
    productsList: Product[],
    tcoResults: TcoResult[]
  ): ProfitInput[] {
    const byId = tcoResults.reduce<Record<string, TcoResult>>((acc, r) => {
      acc[r.productId] = r;
      return acc;
    }, {});
    return productsList.map((p) => {
      const t = byId[p._id];
      const vehiclePrice =
        t?.inputs?.vehiclePrice ??
        (isFinite(numOnly(p.price)) ? numOnly(p.price) : 0);
      const tcoPerKm = t ? t.costPerKm : 15;
      const monthlyRunning = t?.inputs?.monthlyRunning ?? 3000;
      const downPayment =
        t?.inputs?.downPayment ?? Math.round(vehiclePrice * 0.1);
      const resalePct5yr = t?.inputs?.resalePct5yr ?? 25;
      const billedPct = 85;
      const addOnPerKm = 2;
      const fixedAddOns = 3000;
      const freightRate = isFinite(numOnly(p.freightRate))
        ? numOnly(p.freightRate)
        : 28;
      const payloadTon = toTons(p.payload);

      return {
        vehiclePrice,
        tcoPerKm,
        monthlyRunning,
        billedPct,
        freightRate,
        addOnPerKm,
        fixedAddOns,
        downPayment,
        resalePct5yr,
        payloadTon,
      };
    });
  }

  const handleProfitDone = (profitResults: ProfitResult[]) => {
    // Proceed to Compare with both TCO + Profit results
    const productIds = selected.join(",");
    navigate(`/compare/${productIds}`, {
      state: { tcoResults: lastTcoResults, profitResults },
    });
  };

  const clearSelection = () => setSelected([]);

  const handleDownloadBrochure = async (
    productId: string,
    brochureFile?: any
  ) => {
    if (!productId || !brochureFile) {
      alert("Brochure not available");
      return;
    }

    setDownloadingId(productId);
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
      setDownloadingId(null);
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
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>

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

            <Button
              onClick={handleApplyFilters}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>

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
                    <div className="flex items-center justify-end space-x-2 px-3 pt-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(v._id)}
                        onChange={() => toggleSelect(v._id)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer"
                        disabled={
                          !selected.includes(v._id) && selected.length >= 2
                        }
                      />
                      <label
                        htmlFor={`compare-${v._id}`}
                        className="text-white cursor-pointer"
                      >
                        <span className="text-xs">Compare</span>
                      </label>
                    </div>

                    <CardHeader className="p-0 bg-black">
                      <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-black">
                        <img
                          src={v.images?.[0]}
                          alt={v.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 flex flex-col bg-black text-white">
                      <CardTitle className="text-lg font-semibold mb-3 text-white">
                        {v.title}
                      </CardTitle>

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
                            {downloadingId === v._id ? "…" : "PDF"}
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black text-white">
          <DialogHeader>
            <DialogTitle>Finance Calculator</DialogTitle>
          </DialogHeader>
          <MyCalculator
            initialPrice={
              selectedProduct?.price
                ? parseInt(selectedProduct.price, 10)
                : 599000
            }
            selectedProduct={selectedProduct as any}
            selectedProducts={selectedProducts as any}
            onApplyFinance={handleFinanceDone}
            onBack={() => setShowCalculator(false)} // Back to Products
          />
        </DialogContent>
      </Dialog>

      {/* TCO Calculator Modal */}
      {selected.length >= 1 && (
        <TcoCalculator
          open={showTco}
          onOpenChange={setShowTco}
          products={selectedProducts as any}
          onDone={handleTcoDone}
          onBack={handleTcoBack}
          initialInputs={tcoInitialInputs || undefined}
        />
      )}

      {/* Profit Calculator Modal */}
      {selected.length >= 1 &&
        showProfit &&
        profitInitialInputs &&
        profitInitialInputs.length === selectedProducts.length && (
          <ProfitCalculator
            open={true}
            onOpenChange={setShowProfit}
            products={selectedProducts.map((p) => ({
              _id: p._id,
              title: p.title,
            }))}
            initialInputs={profitInitialInputs}
            onDone={handleProfitDone}
            onBack={handleProfitBack} // <-- reopen TCO with previous values
          />
        )}

      <Footer />
    </div>
  );
}
