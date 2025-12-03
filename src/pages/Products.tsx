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
import { competitionCompareFilter } from "@/services/competitionService";
import AuthModal from "@/components/auth/AuthModal";

interface Product {
  brand: ReactNode;
  gvw: ReactNode;
  _id: string;
  title: string;
  model?: string;
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
  type?: "Tata" | "Competitor"; // Add this line

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
  category: string;
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
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<string[]>([]);
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [tataProducts, setTataProducts] = useState<Product[]>([]);
  const [competitorProducts, setCompetitorProducts] = useState<Product[]>([]);
  const [selectedTataId, setSelectedTataId] = useState("");
  const [selectedCompetitorId, setSelectedCompetitorId] = useState("");

  const [compareSelection, setCompareSelection] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const { setFilters, isFiltered, clearFilters } = useFilter();

  // Local dropdown states
  const [authOpen, setAuthOpen] = useState(false);
  const [application, setApplication] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [payload, setPayload] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [category, setCategory] = useState("all");
  // Selection / modals
  const [selected, setSelected] = useState<string[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // TCO modal (opens after Finance)
  const [showTco, setShowTco] = useState(false);
  const [tcoInitialInputs, setTcoInitialInputs] = useState<TcoInput[] | null>(
    null
  );
  const [lastTcoResults, setLastTcoResults] = useState<TcoResult[] | null>(
    null
  );

  const products = useMemo(() => {
    return showCompetitors
      ? [...tataProducts, ...competitorProducts]
      : tataProducts;
  }, [showCompetitors, tataProducts, competitorProducts]);
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

        const hasAnyFilter =
          searchParams.get("application") ||
          searchParams.get("fuelType") ||
          searchParams.get("payload") ||
          searchParams.get("priceRange") ||
          searchParams.get("category");

        if (searchParams.get("application"))
          filters.application = searchParams.get("application");

        if (searchParams.get("fuelType"))
          filters.fuelType = searchParams.get("fuelType");

        if (searchParams.get("payload"))
          filters.payload = searchParams.get("payload");

        if (searchParams.get("priceRange"))
          filters.priceRange = searchParams.get("priceRange");

        if (searchParams.get("category"))
          filters.category = searchParams.get("category");

        // ✅ ✅ FILTER FLOW
        if (hasAnyFilter) {
          const response = await competitionCompareFilter(filters);

          const apiData = response?.data?.data || response?.data || {};

          const real = Array.isArray(apiData.real)
            ? apiData.real
            : Array.isArray(apiData)
            ? apiData
            : [];

          const competitors = Array.isArray(apiData.competitors)
            ? apiData.competitors
            : [];

          setTataProducts(
            real.map((p: any) => ({
              ...p,
              type: "Tata",
            }))
          );

          setCompetitorProducts(
            competitors.map((p: any) => ({
              ...p,
              type: "Competitor",
            }))
          );
        }

        // ✅ ✅ DEFAULT FLOW (getProducts)
        else {
          const res = await getProducts();

          console.log("✅ FINAL PRODUCT ARRAY:", res.length);

          const real = Array.isArray(res) ? res : [];

          setTataProducts(
            real.map((p: any) => ({
              ...p,
              type: "Tata",
            }))
          );

          setCompetitorProducts([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        setTataProducts([]);
        setCompetitorProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAsync();
  }, [location.search]);

  useEffect(() => {
    console.log("✅ TOTAL PRODUCTS SHOWN:", products.length);
    console.log("✅ TATA:", tataProducts.length);
    console.log("✅ COMP:", competitorProducts.length);
  }, [products, tataProducts, competitorProducts]);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setShowCompetitors(true);
    }
  }, []);

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
  //   debugger;

  const handleApplyFilters = async () => {
    setLoading(true);

    try {
      const filterParams: any = {};

      if (application !== "all") filterParams.application = application;
      if (fuelType !== "all") filterParams.fuelType = fuelType;
      if (payload !== "all") filterParams.payload = payload;
      if (priceRange !== "all") filterParams.priceRange = priceRange;

      // ✅ CATEGORY MAPPING (UI → API)
      if (category === "bus") filterParams.category = "SCV Passenger";
      if (category === "cargo") filterParams.category = "SCV Cargo";

      // ✅ Update URL
      const searchParams = new URLSearchParams(filterParams).toString();
      navigate(`/products?${searchParams}`, { replace: true });

      // ✅ API CALL
      const response = await competitionCompareFilter(filterParams);

      // ✅ RENAME payload → apiData (THIS FIXES YOUR ERROR)
      const apiData = response?.data?.data || response?.data || {};

      const real = (apiData.real || []).map((p: any) => ({
        ...p,
        type: "Tata",
      }));

      const competitors = (apiData.competitors || []).map((p: any) => ({
        ...p,
        type: "Competitor",
      }));

      setTataProducts(real);
      setCompetitorProducts(competitors);
      setFilters(filterParams);

      console.log("✅ FILTER APPLIED:", filterParams);
      console.log("✅ TATA:", real.length);
      console.log("✅ COMP:", competitors.length);
    } catch (err) {
      console.error("❌ Failed to apply filters:", err);
      setTataProducts([]);
      setCompetitorProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setApplication("all");
    setFuelType("all");
    setPayload("all");
    setPriceRange("all");
    setCategory("all");
    setSearchTerm("");
    clearFilters();
    navigate("/products", { replace: true });
  };

  const filteredProducts = products.filter((p) => {
    const name =
      (typeof p.title === "string" && p.title.trim() !== ""
        ? p.title
        : p.model) || "";

    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ✅ SEO: schema for collection of vehicles
  const collectionSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Tata Motors Commercial Vehicle Range | Vikramshila Automobiles",
      url: "https://vikramshilaautomobiles.com/products",
      isPartOf: {
        "@type": "WebSite",
        name: "Vikramshila Automobiles",
        url: "https://vikramshilaautomobiles.com",
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: filteredProducts.slice(0, 50).map((p, index) => ({
          "@type": "Product",
          position: index + 1,
          name:
            typeof p.title === "string"
              ? p.title
              : String(p.model ?? "Tata Commercial Vehicle"),
          url: `https://vikramshilaautomobiles.com/products/${p._id}`,
        })),
      },
    }),
    [filteredProducts]
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

  function getCompanyHeading(p?: Product) {
    if (!p) return "Select Vehicle";

    // ✅ For Tata Vehicles
    if (p.type === "Tata") {
      return p.brand && typeof p.brand === "string" ? p.brand : "Tata Motors";
    }

    // ✅ For Competitor Vehicles
    const brandText =
      typeof p.brand === "string"
        ? p.brand.trim()
        : (p.brand as any)?.toString?.() || "";

    // if brand name not found, fallback to first part of title or model
    const firstWord = (s?: string) =>
      (typeof s === "string" ? s : "").trim().split(/\s+/)[0] || "";

    const brandName =
      brandText ||
      firstWord(p.title) ||
      firstWord(p.model) ||
      "Competitor Brand";

    return brandName;
  }

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
    // Proceed to Compare with both TCO + asdasdProfit results
    const productIds = selected.join(",");
    navigate(`/compare/${productIds}`, {
      state: { tcoResults: lastTcoResults, profitResults },
    });
  };

  const clearSelection = () => setSelected([]);

  const handleSecureDownloadBrochure = async (productId?: string) => {
    const id = productId;

    if (!id) {
      alert("Brochure not available");
      return;
    }

    const isLoggedIn = !!localStorage.getItem("user");

    // ✅ ONLY THIS FOR LOGIN OPEN
    if (!isLoggedIn) {
      window.dispatchEvent(new Event("OPEN_AUTH_MODAL"));
      return;
    }

    try {
      setDownloadingId(id);

      const API_URL = import.meta.env.VITE_API_URL;
      const brochureUrl = `${API_URL}/products/${id}/brochure`;

      window.open(brochureUrl, "_blank");
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white relative">
      {/* ✅ SEO HEAD META FOR PRODUCT LIST PAGE */}
      <Helmet>
        <title>
          Tata Commercial Vehicles | SCV, LCV, ICV, Pickups, Buses | Vikramshila
          Automobiles
        </title>

        <meta
          name="description"
          content="Browse Tata Motors commercial vehicles including Tata Intra V70, Intra V50, Ace Gold, Yodha Pickup, Magic, Winger, LCV, ICV, MCV and Buses. Compare payload, mileage, GVW, applications & EMI options for Bihar routes."
        />

        <meta
          name="keywords"
          content="tata commercial vehicles bihar, tata intra v70 price bihar, tata intra v50 payload, tata ace gold price bhagalpur, tata yodha pickup price patna, tata lcv trucks bihar, tata icv trucks bihar, tata buses bhagalpur, tata magic mantra bihar, vikramshila automobiles dealer"
        />

        <link
          rel="canonical"
          href="https://vikramshilaautomobiles.com/products"
        />

        <meta
          property="og:title"
          content="Tata Motors Commercial Vehicle Range | Vikramshila Automobiles"
        />
        <meta
          property="og:description"
          content="Explore Tata Motors SCV, LCV, ICV, Pickups & Buses at Vikramshila Automobiles. Compare payload, mileage, body size and EMI options for your business in Bihar."
        />
        <meta property="og:image" content="/og-banner.jpg" />
        <meta
          property="og:url"
          content="https://vikramshilaautomobiles.com/products"
        />

        {/* ✅ Structured data using dynamic collectionSchema */}
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
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

      {/* 🔹 Toggle Comparison Mode Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-3">
          <h2 className="text-lg font-semibold text-white">
            Tata Commercial Vehicle Catalogue
          </h2>
          {!showCompetitors ? (
            <Button
              onClick={() => {
                console.log("✅ Compare Button Clicked");

                const isLoggedIn = !!localStorage.getItem("user");
                console.log("✅ isLoggedIn:", isLoggedIn);

                if (!isLoggedIn) {
                  console.log("🔐 Opening Login Modal");
                  setShowAuthModal(true);
                } else {
                  console.log("🟢 Opening Comparison Mode");
                  setShowCompetitors(true);
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium px-4"
            >
              Compare with Competitor Products
            </Button>
          ) : (
            <Button
              onClick={() => {
                console.log("🔴 Logging Out Comparison Mode");
                localStorage.removeItem("user"); // ✅ LOGOUT CORRECT KEY
                setShowCompetitors(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4"
            >
              Logout Comparison Mode
            </Button>
          )}
        </div>
      </div>

      {showCompetitors && (
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 py-6">
          <div className="container mx-auto px-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-500" /> Compare Vehicles
              Instantly
            </h3>

            {/* Dropdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {compareSelection.map((selectedId, index) => {
                const selectedSet = new Set(compareSelection.filter(Boolean));

                const availableTata = tataProducts.filter(
                  (p) => !selectedSet.has(p._id) || p._id === selectedId
                );
                const availableCompetitors = competitorProducts.filter(
                  (p) => !selectedSet.has(p._id) || p._id === selectedId
                );

                // find the currently selected product (from either list)
                const selectedProduct = [
                  ...tataProducts,
                  ...competitorProducts,
                ].find((p) => p._id === selectedId);

                // dynamic heading
                const headingLabel = selectedId
                  ? getCompanyHeading(selectedProduct)
                  : `Vehicle ${index + 1}`;

                return (
                  <div
                    key={index}
                    className="flex flex-col bg-black border border-gray-800 rounded-lg p-3 sm:p-4 shadow-sm hover:border-blue-500 transition-all"
                  >
                    {/* 🔹 this is the ONLY visible change */}
                    <label className="text-sm text-gray-400 mb-2">
                      {headingLabel}
                    </label>
                    <select
                      value={selectedId}
                      onChange={(e) => {
                        const updated = [...compareSelection];
                        updated[index] = e.target.value;
                        setCompareSelection(updated);

                        // ✅ AUTO TRIGGER FILTER WHEN AT LEAST 1 VEHICLE SELECTED
                        const activeIds = updated.filter(Boolean);

                        if (activeIds.length >= 1) {
                          const selectedProducts = [
                            ...tataProducts,
                            ...competitorProducts,
                          ].filter((p) => activeIds.includes(p._id));

                          const selectedPayload = selectedProducts[0]?.payload;
                          const selectedFuel = selectedProducts[0]?.fuelType;
                          const selectedCategory =
                            selectedProducts[0]?.category;

                          const autoFilter: any = {};

                          if (selectedPayload)
                            autoFilter.payload = selectedPayload;
                          if (selectedFuel) autoFilter.fuelType = selectedFuel;
                          if (selectedCategory)
                            autoFilter.category = selectedCategory;

                          console.log("✅ AUTO COMPARE FILTER:", autoFilter);

                          competitionCompareFilter(autoFilter).then(
                            (response) => {
                              const apiData =
                                response?.data?.data || response?.data || {};

                              const real = (apiData.real || []).map(
                                (p: any) => ({
                                  ...p,
                                  type: "Tata",
                                })
                              );

                              const competitors = (
                                apiData.competitors || []
                              ).map((p: any) => ({
                                ...p,
                                type: "Competitor",
                              }));

                              setTataProducts(real);
                              setCompetitorProducts(competitors);
                            }
                          );
                        }
                      }}
                      className="bg-zinc-900 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                    >
                      {/* ✅ DEFAULT PLACEHOLDER */}
                      <option value="">Select Vehicle</option>

                      {/* ✅ TATA VEHICLES GROUP */}
                      <optgroup label="Tata Vehicles">
                        {availableTata.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.title || p.model}
                          </option>
                        ))}
                      </optgroup>

                      {/* ✅ COMPETITOR VEHICLES GROUP */}
                      <optgroup label="Competitor Vehicles">
                        {availableCompetitors.map((p) => (
                          <option key={p._id} value={p._id}>
                            {typeof p.brand === "string" ? p.brand : ""}{" "}
                            {p.title || p.model}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Summary */}
              <p className="text-sm text-gray-400">
                {compareSelection.filter(Boolean).length} of 4 selected
              </p>

              <div className="flex flex-wrap gap-3">
                {/* Clear Button */}
                <Button
                  variant="outline"
                  onClick={() => setCompareSelection(["", "", "", ""])}
                  className="border-gray-700 bg-white text-black hover:bg-gray-100 hover:text-black font-medium"
                >
                  Clear Selection
                </Button>
                <Button
                  disabled={compareSelection.filter(Boolean).length < 2}
                  onClick={() => {
                    const validIds = compareSelection.filter(Boolean);
                    if (validIds.length >= 2) {
                      // Collect selected product objects (from both Tata + Competitors)
                      const selectedProducts = [
                        ...tataProducts,
                        ...competitorProducts,
                      ].filter((p) => validIds.includes(p._id));

                      // Build a clean id:type map for every selected product
                      const idMap = selectedProducts.map((p) => ({
                        id: p._id,
                        type: p.type === "Competitor" ? "Competitor" : "Tata",
                      }));

                      console.log("🧭 Navigating with:", idMap);

                      // Pass along both the IDs (for URL) and id:type map (for logic)
                      navigate(`/compare/${validIds.join(",")}`, {
                        state: { idMap },
                      });
                    }
                  }}
                  className={`${
                    compareSelection.filter(Boolean).length >= 2
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-700 cursor-not-allowed"
                  } text-white px-6`}
                >
                  Compare Selected ({compareSelection.filter(Boolean).length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 sm:py-10">
        {/* Main layout: stack on mobile, side-by-side on md+ */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-80 lg:w-96 bg-black rounded-lg border border-gray-800 p-5 sm:p-6 flex flex-col">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-500" />
                  <h2 className="text-base font-semibold">
                    Filter Tata Vehicles
                  </h2>
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
                  placeholder="Search vehicles (e.g. Intra, Ace, Yodha)"
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
                    <option value="all">Choose Fuel Type</option>
                    <option value="CNG">CNG</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
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
                    <option value="all">Choose Payload</option>
                    <option value="500-750">500 - 750 Kg (Ace Gold)</option>
                    <option value="750-1500">750 - 1500 Kg</option>
                    <option value="1500-3000">
                      1500 - 3000 Kg (Intra / Yodha)
                    </option>
                    <option value="3000-6000">3000 - 6000 Kg</option>
                    <option value="6000+">6000 Kg + (ICV / Buses)</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>
                {/* ✅ CATEGORY FILTER */}
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none w-full bg-black border border-gray-700 px-3 py-2 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                  >
                    <option value="all">Choose Category</option>
                    <option value="bus">Bus</option>
                    <option value="cargo">Cargo</option>
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
                    <option value="all">Vehicle Price Range</option>
                    <option value="500000-1500000">₹5 - ₹15 Lakhs</option>
                    <option value="1500000-2000000">₹15 - ₹20 Lakhs</option>
                    <option value="2000000-2500000">₹20 - ₹25 Lakhs</option>
                    <option value="2500000-3000000">₹25 - ₹30 Lakhs</option>
                    <option value="3000000+">₹30 Lakhs +</option>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">
                Tata Commercial Vehicles in Bihar
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                {filteredProducts.length} vehicle
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16 sm:py-20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-400">Loading vehicles...</span>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-gray-900 rounded-lg border border-gray-800">
                <div className="max-w-md mx-auto">
                  <Search className="w-14 h-14 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredProducts.map((v) => (
                    <Card
                      key={v._id}
                      className="bg-black border border-gray-800 rounded-lg overflow-hidden group relative w-full"
                    >
                      {/* 🔹 Competitor Badge */}
                      {v.type === "Competitor" && (
                        <div className="absolute top-2 left-2 bg-red-600 text-[11px] font-semibold px-2 py-1 rounded shadow">
                          Competitor
                        </div>
                      )}

                      {/* 🔹 Compare Checkbox */}
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

                      {/* 🔹 Image */}
                      <CardHeader className="p-0 bg-black">
                        <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-black">
                          <img
                            src={v.images?.[0]}
                            alt={v.title || v.model || "Vehicle"}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </CardHeader>

                      {/* 🔹 Product Info */}
                      <CardContent className="p-4 flex flex-col bg-black text-white">
                        <CardTitle className="text-base sm:text-lg font-semibold mb-3 text-white">
                          {v.title || v.model}
                        </CardTitle>

                        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center text-xs sm:text-sm text-gray-300 mb-4">
                          <div>
                            <p className="font-bold text-white">
                              {v.gvw || "-"}
                            </p>
                            <p className="text-[11px] sm:text-xs text-gray-400">
                              Tonnage (GVW)
                            </p>
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {v.fuelTankCapacity || "-"}
                            </p>
                            <p className="text-[11px] sm:text-xs text-gray-400">
                              Fuel Tank
                            </p>
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {v.payload || "-"}
                            </p>
                            <p className="text-[11px] sm:text-xs text-gray-400">
                              Payload
                            </p>
                          </div>
                        </div>

                        {/* 🔹 Buttons */}
                        <div className="flex flex-col xs:flex-row sm:flex-row gap-3 mt-auto">
                          <Link
                            to={`/products/${v._id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-center"
                          >
                            Know More
                          </Link>

                          {v.brochureFile && (
                            <button
                              onClick={() =>
                                handleSecureDownloadBrochure(v._id)
                              }
                              className="flex items-center justify-center w-full sm:w-11 h-11 rounded-md sm:rounded-full border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white"
                            >
                              {downloadingId === v._id ? "…" : "PDF"}
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ✅ SEO CONTENT BLOCK FOR KEYWORDS */}
                <section className="mt-16 text-gray-300 text-sm leading-relaxed space-y-4">
                  <h2 className="text-xl font-semibold text-white">
                    Tata SCV, LCV, ICV, Pickups & Buses for Every Business in
                    Bihar
                  </h2>

                  <p>
                    Vikramshila Automobiles is an authorized Tata Motors
                    commercial vehicle dealer in Bihar offering the complete
                    range of <strong>SCV, LCV, ICV, pickups and buses</strong>.
                    From last-mile cargo vehicles like{" "}
                    <strong>Tata Ace Gold</strong> and{" "}
                    <strong>Tata Intra V30 / V50 / V70</strong> to high capacity
                    trucks and school / staff buses, we help you select the
                    right vehicle as per route, load and business type.
                  </p>

                  <p>
                    If you are looking for{" "}
                    <strong>
                      ICV trucks in Bihar, LCV trucks for rural routes
                    </strong>
                    , pickups for e-commerce / agriculture, or{" "}
                    <strong>Tata Magic / Winger</strong> for passenger
                    operations, our team can guide you with on-road price, EMI,
                    mileage, GVW, body size and application suitability.
                  </p>

                  <p>
                    We serve customers across{" "}
                    <strong>
                      Bhagalpur, Banka, Khagaria, Munger, Begusarai
                    </strong>{" "}
                    and nearby districts with finance, insurance, body building
                    support and after-sales service. Fill the enquiry form or
                    click on any vehicle to know detailed specifications,
                    brochure and EMI calculation.
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Conditional Buttons */}
      {selected.length > 0 && (
        <>
          {/* Desktop / Tablet: keep your vertical rail button */}
          <div className="z-50 hidden md:block">
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

          {/* Mobile: bottom safe-area bar */}
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-zinc-900/95 backdrop-blur border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3 [padding-bottom:calc(env(safe-area-inset-bottom)+12px)]">
            <div className="text-xs text-gray-300">
              {selected.length} selected
            </div>
            {selected.length === 1 && (
              <Button
                onClick={openCalculator}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Choose Vehicle
              </Button>
            )}
            {selected.length === 2 && (
              <Button
                onClick={handleCompareProducts}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Compare
              </Button>
            )}
            {selected.length > 2 && (
              <div className="text-xs text-red-300">
                Only 2 products allowed
              </div>
            )}
          </div>
        </>
      )}

      {/* Finance Calculator Modal */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto bg-black text-white">
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
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => {
          setShowAuthModal(false);
          // refresh login state in page
          window.dispatchEvent(new Event("storage"));
        }}
      />
      <Footer />
    </div>
  );
}
