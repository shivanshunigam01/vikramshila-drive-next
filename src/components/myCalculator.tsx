import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  selectedProducts?: Product[]; // when 2 products
  onApplyFinance?: (args: {
    financeData: {
      vehiclePrice: number;
      downPaymentPercentage: number;
      downPaymentAmount: number;
      tenure: number; // months
      interestRate: number;
      loanAmount: number;
      estimatedEMI: number;
    };
    financedProductId: string;
  }) => void;
}

export default function MyCalculator({
  initialPrice = 599000,
  selectedProduct,
  selectedProducts,
  onApplyFinance,
}: MyCalculatorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(36);
  const [roi, setRoi] = useState(9.5);
  const navigate = useNavigate();

  const defaultTarget =
    selectedProduct ??
    (selectedProducts && selectedProducts.length > 0
      ? selectedProducts[0]
      : undefined);

  const [financeTarget, setFinanceTarget] = useState<Product | undefined>(
    defaultTarget
  );

  useEffect(() => {
    if (financeTarget?.price) {
      const p = parseInt(financeTarget.price as unknown as string, 10);
      if (!Number.isNaN(p)) setPrice(p);
    } else {
      setPrice(initialPrice);
    }
  }, [financeTarget, initialPrice]);

  const downPayment = useMemo(
    () => Math.round((downPct / 100) * price),
    [downPct, price]
  );
  const principal = useMemo(
    () => Math.max(price - downPayment, 0),
    [price, downPayment]
  );
  const emi = useMemo(() => {
    const r = roi / 12 / 100;
    const n = tenure;
    if (r === 0) return principal / n;
    const e = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(e);
  }, [principal, roi, tenure]);

  const handleContinue = () => {
    const financeData = {
      vehiclePrice: price,
      downPaymentPercentage: downPct,
      downPaymentAmount: downPayment,
      tenure,
      interestRate: roi,
      loanAmount: principal,
      estimatedEMI: emi,
    };

    // Two-product flow → call back to parent to open TCO
    if (selectedProducts && selectedProducts.length === 2 && onApplyFinance) {
      onApplyFinance({
        financeData,
        financedProductId: financeTarget?._id ?? selectedProducts[0]._id,
      });
      return;
    }

    // Single-product flow → same as before
    navigate("/review", {
      state: { product: selectedProduct, financeData },
    });
  };

  return (
    <section className="w-full bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-10 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Finance Calculator
          </h2>
          <p className="text-gray-400 mt-2">
            Adjust sliders to estimate your EMI instantly.
          </p>
        </header>

        {selectedProducts && selectedProducts.length === 2 && (
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-300">
              Choose vehicle to finance
            </label>
            <select
              className="mt-2 w-full bg-gray-900 border border-gray-700 text-white rounded px-3 py-2 text-sm"
              value={financeTarget?._id}
              onChange={(e) => {
                const next = selectedProducts.find(
                  (p) => p._id === e.target.value
                );
                setFinanceTarget(next);
              }}
            >
              {selectedProducts.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Vehicle Price
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-2 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Down Payment ({downPct}%)</span>
                <span>{formatINR(downPayment)}</span>
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
          </div>

          {/* Result Card */}
          <div className="rounded-xl border border-gray-800 p-6 bg-[#1e2125] shadow-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Loan Amount</span>
                <span className="font-medium text-white">
                  {formatINR(principal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated EMI</span>
                <span className="text-2xl font-semibold text-blue-400">
                  {formatINR(emi)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {selectedProducts && selectedProducts.length === 2
                  ? "Apply Finance & Continue to TCO"
                  : "Review & Submit Quote for the Product"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
