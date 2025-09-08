import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

function formatINR(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: string;
}

interface MyCalculatorProps {
  initialPrice?: number;
  selectedProduct?: Product;
  selectedProducts?: Product[]; // when 2 products (or 1)
  onApplyFinance?: (args: {
    financeData: {
      vehiclePrice: number; // price used when single product
      downPaymentPercentage: number;
      downPaymentAmount: number;
      tenure: number; // months
      interestRate: number;
      loanAmount: number;
      estimatedEMI: number;
    };
    financedProductId: string; // for single flow (kept for backward compatibility)
  }) => void;
  onBack?: () => void;
}

export default function MyCalculator({
  initialPrice = 599000,
  selectedProduct,
  selectedProducts,
  onApplyFinance,
  onBack,
}: MyCalculatorProps) {
  const twoMode = !!(selectedProducts && selectedProducts.length === 2);

  // Controls (shared settings; applied to both products in two-mode)
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(36);
  const [roi, setRoi] = useState(9.5);

  // Determine prices (single vs two)
  const priceA = useMemo(() => {
    if (twoMode) {
      const p = parseInt(selectedProducts![0].price as unknown as string, 10);
      return Number.isFinite(p) ? p : initialPrice;
    }
    if (selectedProduct?.price) {
      const p = parseInt(selectedProduct.price as unknown as string, 10);
      return Number.isFinite(p) ? p : initialPrice;
    }
    return initialPrice;
  }, [twoMode, selectedProducts, selectedProduct, initialPrice]);

  const priceB = useMemo(() => {
    if (!twoMode) return null;
    const p = parseInt(selectedProducts![1].price as unknown as string, 10);
    return Number.isFinite(p) ? p : initialPrice;
  }, [twoMode, selectedProducts, initialPrice]);

  // In single mode, allow editing the price field directly
  const [singlePrice, setSinglePrice] = useState<number>(priceA);

  useEffect(() => setSinglePrice(priceA), [priceA]);

  // Computation helpers
  const compute = (price: number) => {
    const down = Math.round((downPct / 100) * price);
    const principal = Math.max(price - down, 0);
    const r = roi / 12 / 100;
    const n = tenure;
    const emi =
      r === 0
        ? Math.round(principal / n)
        : Math.round(
            (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
          );
    return { price, down, principal, emi };
  };

  const A = compute(twoMode ? priceA : singlePrice);
  const B = twoMode && priceB != null ? compute(priceB) : null;

  const handleContinue = () => {
    // Preserve existing callback contract.
    if (onApplyFinance) {
      // We pass financeData for the primary product (A). Parent uses shared settings to seed TCO for both.
      onApplyFinance({
        financeData: {
          vehiclePrice: A.price,
          downPaymentPercentage: downPct,
          downPaymentAmount: A.down,
          tenure,
          interestRate: roi,
          loanAmount: A.principal,
          estimatedEMI: A.emi,
        },
        financedProductId: twoMode
          ? selectedProducts![0]._id
          : selectedProduct?._id || "",
      });
    }
  };

  return (
    <section className="w-full bg-black py-6">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-6 text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Finance Calculator {twoMode ? "(Compare EMI for both)" : ""}
          </h2>
          <p className="text-gray-400 mt-1">
            Set finance terms.{" "}
            {twoMode
              ? "We apply them to both vehicles so you can compare EMI side-by-side."
              : "See your estimated EMI instantly."}
          </p>
        </header>

        {/* Controls (shared) */}
        <div
          className={`grid ${
            twoMode ? "lg:grid-cols-3" : "lg:grid-cols-2"
          } gap-6`}
        >
          {/* Finance controls */}
          <div className="space-y-5 lg:col-span-1">
            {/* Price (single only) */}
            {!twoMode && (
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Vehicle Price
                </label>
                <Input
                  type="number"
                  value={singlePrice}
                  onChange={(e) => setSinglePrice(Number(e.target.value))}
                  className="mt-2 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Down Payment ({downPct}%)</span>
                <span>
                  {formatINR(
                    Math.round(
                      (downPct / 100) * (twoMode ? priceA : singlePrice)
                    )
                  )}
                </span>
              </div>
              <Slider
                value={[downPct]}
                min={0}
                max={50}
                step={1}
                onValueChange={([v]) => setDownPct(v)}
                className="mt-3"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Tenure</span>
                <span>{tenure} months</span>
              </div>
              <Slider
                value={[tenure]}
                min={12}
                max={84}
                step={6}
                onValueChange={([v]) => setTenure(v)}
                className="mt-3"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Interest Rate</span>
                <span>{roi}% p.a.</span>
              </div>
              <Slider
                value={[roi]}
                min={6}
                max={16}
                step={0.5}
                onValueChange={([v]) => setRoi(v)}
                className="mt-3"
              />
            </div>

            <div className="mt-6 flex justify-between items-center">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="border-gray-700 text-black hover:text-white"
                >
                  Back
                </Button>
              )}

              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {twoMode
                  ? "Apply Finance & Continue to TCO"
                  : "Apply Finance & Continue to TCO"}
              </Button>
            </div>
          </div>

          {/* EMI Card(s) */}
          <div
            className={`${twoMode ? "lg:col-span-2" : "lg:col-span-1"} grid ${
              twoMode ? "md:grid-cols-2" : "md:grid-cols-1"
            } gap-6`}
          >
            {/* Product A */}
            <EmiCard
              title={
                twoMode
                  ? selectedProducts![0].title
                  : selectedProduct?.title || "Selected Vehicle"
              }
              price={A.price}
              down={A.down}
              principal={A.principal}
              emi={A.emi}
            />

            {/* Product B (only in two-mode) */}
            {twoMode && B && (
              <EmiCard
                title={selectedProducts![1].title}
                price={B.price}
                down={B.down}
                principal={B.principal}
                emi={B.emi}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmiCard({
  title,
  price,
  down,
  principal,
  emi,
}: {
  title: string;
  price: number;
  down: number;
  principal: number;
  emi: number;
}) {
  return (
    <div className="rounded-xl border border-gray-800 p-6 bg-[#1e2125] shadow-lg">
      <div className="text-white font-semibold mb-4">{title}</div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Vehicle Price</span>
          <span className="font-medium text-white">{formatINR(price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Down Payment</span>
          <span className="font-medium text-white">{formatINR(down)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Loan Amount</span>
          <span className="font-medium text-white">{formatINR(principal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Estimated EMI</span>
          <span className="text-2xl font-semibold text-blue-400">
            {formatINR(emi)}
          </span>
        </div>
      </div>
    </div>
  );
}
