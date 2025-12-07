import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatINR(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function FinanceCalculator({
  initialPrice = 599000,
}: {
  initialPrice?: number;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(36);
  const [roi, setRoi] = useState(9.5);
  const navigate = useNavigate();

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

  let user: any = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    user = null;
  }
  const waText = encodeURIComponent(
    `Hello Vikramshila Automobiles, I'm interested in finance options.
Price: ${formatINR(price)},
Down: ${formatINR(downPayment)},
Tenure: ${tenure} months,
ROI: ${roi}%,
EMI approx: ${formatINR(emi)}.

My Details:
Name: ${user?.name || "N/A"},
Email: ${user?.email || "N/A"},
Phone: ${user?.phone || "N/A"}`
  );
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

        <div className="grid md:grid-cols-2 gap-8">
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

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/918406991610?text=${waText}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white text-sm">
                  Send to WhatsApp
                </Button>
              </a>
              <Button
                onClick={() => navigate("/finance-documents")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                Apply for Finance
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
