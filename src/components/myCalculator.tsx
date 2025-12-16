"use client";

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
}

interface MyCalculatorProps {
  initialPrice?: number;
  selectedProduct?: Product;
  selectedProducts?: Product[];
  onApplyFinance?: (args: {
    financeData: {
      vehiclePrice: number;
      downPaymentPercentage: number;
      downPaymentAmount: number;
      tenure: number;
      interestRate: number;
      loanAmount: number;
      estimatedEMI: number;
    };
    financedProductId: string;
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

  /** -------------------------------
   * PRICE STATES (fully editable)
   --------------------------------*/
  const backendPriceA = selectedProduct
    ? parseInt(selectedProduct.price)
    : selectedProducts
    ? parseInt(selectedProducts[0].price)
    : initialPrice;

  const backendPriceB =
    twoMode && selectedProducts ? parseInt(selectedProducts[1].price) : null;

  const [priceA, setPriceA] = useState<string>(String(backendPriceA));
  const [priceB, setPriceB] = useState<string>(
    backendPriceB ? String(backendPriceB) : ""
  );

  /** Refresh price input when product changes */
  useEffect(() => {
    setPriceA(String(backendPriceA));
    if (twoMode && backendPriceB != null) setPriceB(String(backendPriceB));
  }, [backendPriceA, backendPriceB, twoMode]);

  /** Finance Controls */
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(36);
  const [roi, setRoi] = useState(9.5);

  /** -------------------------------
   * CALC LOGIC
   --------------------------------*/
  const compute = (raw: string) => {
    const price = Number(raw);

    if (!raw || isNaN(price) || price <= 0)
      return { valid: false, price: 0, down: 0, principal: 0, emi: 0 };

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

    return { valid: true, price, down, principal, emi };
  };

  const A = compute(priceA);
  const B = twoMode ? compute(priceB) : null;

  /** -------------------------------
   * VALIDATION
   --------------------------------*/
  const validate = () => {
    if (!A.valid) return "Enter valid Price for Vehicle A";

    if (twoMode && B && !B.valid) return "Enter valid Price for Vehicle B";

    return null;
  };

  /** -------------------------------
   * Continue Click
   --------------------------------*/
  const handleContinue = () => {
    if (!onApplyFinance) return;

    const payload: any = {
      financedProductId: twoMode
        ? selectedProducts![0]._id
        : selectedProduct?._id || "",
      financeData: {
        A: {
          vehiclePrice: A.price,
          loanAmount: A.principal,
          downPayment: A.down,
          interestRate: roi,
          tenureYears: Math.round(tenure / 12),
          emi: A.emi,
        },
        B: twoMode
          ? {
              vehiclePrice: B!.price,
              loanAmount: B!.principal,
              downPayment: B!.down,
              interestRate: roi,
              tenureYears: Math.round(tenure / 12),
              emi: B!.emi,
            }
          : null,
      },
    };

    onApplyFinance(payload);
  };

  return (
    <section className="w-full bg-black py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Finance Calculator {twoMode ? "(Compare EMI for both)" : ""}
        </h2>

        <div
          className={`grid ${
            twoMode ? "lg:grid-cols-3" : "lg:grid-cols-2"
          } gap-6`}
        >
          {/* Left Controls */}
          <div className="space-y-5">
            {/* Editable Price (Single or Dual) */}
            {!twoMode && (
              <div>
                <label className="text-sm text-gray-300">Vehicle Price</label>
                <Input
                  value={priceA}
                  onChange={(e) => setPriceA(e.target.value)}
                  placeholder="Enter Price"
                  className="mt-2 bg-gray-900 text-white"
                />
              </div>
            )}

            {twoMode && (
              <>
                <div>
                  <label className="text-sm text-gray-300">
                    {selectedProducts![0].title} Price
                  </label>
                  <Input
                    value={priceA}
                    onChange={(e) => setPriceA(e.target.value)}
                    placeholder="Enter Price"
                    className="mt-2 bg-gray-900 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">
                    {selectedProducts![1].title} Price
                  </label>
                  <Input
                    value={priceB}
                    onChange={(e) => setPriceB(e.target.value)}
                    placeholder="Enter Price"
                    className="mt-2 bg-gray-900 text-white"
                  />
                </div>
              </>
            )}

            {/* DP */}
            <div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Down Payment ({downPct}%)</span>
                <span>{A.valid ? formatINR(A.down) : "-"}</span>
              </div>
              <Slider
                value={[downPct]}
                min={0}
                max={50}
                step={1}
                onValueChange={([v]) => setDownPct(v)}
              />
            </div>

            {/* Tenure */}
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
              />
            </div>

            {/* ROI */}
            <div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Interest Rate</span>
                <span>{roi}%</span>
              </div>
              <Slider
                value={[roi]}
                min={6}
                max={16}
                step={0.5}
                onValueChange={([v]) => setRoi(v)}
              />
            </div>

            <Button className="bg-blue-600 w-full" onClick={handleContinue}>
              Continue to TCO
            </Button>
          </div>

          {/* EMI Cards */}
          <div
            className={`${
              twoMode ? "lg:col-span-2" : ""
            } grid md:grid-cols-2 gap-6`}
          >
            <EmiCard
              title={
                twoMode
                  ? selectedProducts![0].title
                  : selectedProduct?.title || "Selected"
              }
              data={A}
            />
            {twoMode && (
              <EmiCard title={selectedProducts![1].title} data={B!} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmiCard({ title, data }: { title: string; data: any }) {
  return (
    <div className="rounded-xl bg-[#1e2125] p-6 border border-gray-800">
      <h3 className="text-white font-semibold mb-4">{title}</h3>

      <div className="space-y-3">
        <Row
          label="Vehicle Price"
          value={data.valid ? formatINR(data.price) : "-"}
        />
        <Row
          label="Down Payment"
          value={data.valid ? formatINR(data.down) : "-"}
        />
        <Row
          label="Loan Amount"
          value={data.valid ? formatINR(data.principal) : "-"}
        />
        <Row
          label="Estimated EMI"
          value={data.valid ? formatINR(data.emi) : "-"}
          big
        />
      </div>
    </div>
  );
}

function Row({ label, value, big }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={big ? "text-2xl font-bold text-blue-400" : "text-white"}>
        {value}
      </span>
    </div>
  );
}
