import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export default function FinanceCalculator({ initialPrice = 599000 }: { initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(36);
  const [roi, setRoi] = useState(9.5);

  const downPayment = useMemo(() => Math.round((downPct / 100) * price), [downPct, price]);
  const principal = useMemo(() => Math.max(price - downPayment, 0), [price, downPayment]);
  const emi = useMemo(() => {
    const r = roi / 12 / 100;
    const n = tenure;
    if (r === 0) return principal / n;
    const e = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(e);
  }, [principal, roi, tenure]);

  const waText = encodeURIComponent(`Hello Vikramshila Automobiles, I'm interested in finance options. Price: ${formatINR(price)}, Down: ${formatINR(downPayment)}, Tenure: ${tenure} months, ROI: ${roi}%. EMI approx: ${formatINR(emi)}.`);

  return (
    <section className="container mx-auto py-10">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Finance Calculator</h2>
        <p className="text-muted-foreground">Adjust sliders to estimate your EMI instantly.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Vehicle Price</label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm"><span>Down Payment ({downPct}%)</span><span>{formatINR(downPayment)}</span></div>
            <Slider value={[downPct]} min={0} max={50} step={1} onValueChange={([v]) => setDownPct(v)} className="mt-3" />
          </div>
          <div>
            <div className="flex justify-between text-sm"><span>Tenure</span><span>{tenure} months</span></div>
            <Slider value={[tenure]} min={12} max={84} step={6} onValueChange={([v]) => setTenure(v)} className="mt-3" />
          </div>
          <div>
            <div className="flex justify-between text-sm"><span>Interest Rate</span><span>{roi}% p.a.</span></div>
            <Slider value={[roi]} min={6} max={16} step={0.5} onValueChange={([v]) => setRoi(v)} className="mt-3" />
          </div>
        </div>
        <div className="rounded-lg border p-6 bg-muted/30">
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Loan Amount</span><span className="font-medium">{formatINR(principal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Estimated EMI</span><span className="text-2xl font-semibold">{formatINR(emi)}</span></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`https://wa.me/919999999999?text=${waText}`} target="_blank" rel="noreferrer">
              <Button variant="accent">Send to WhatsApp</Button>
            </a>
            <Button variant="hero">Apply for Finance</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
