import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Product = {
  _id: string;
  title: string;
  price?: string;
  mileage?: string;
  tyresCost?: string | number;
  tyreLife?: string;
  fuelType?: string;
  freightRate?: string;
};

export type TcoInput = {
  vehiclePrice: number;
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  downPayment: number;
  monthlyRunning: number;
  mileage: number;
  fuelPrice: number;
  monthlyMaintenance: number;
  insuranceYear: number;
  tyresCost: number;
  tyreLife: number;
  resalePct5yr: number;
};

export type TcoResult = {
  productId: string;
  productTitle: string;
  monthlyEmi: number;
  monthlyFuel: number;
  monthlyInsurance: number;
  monthlyTyre: number;
  monthlyMaintenance: number;
  monthlyOwnership: number;
  costPerKm: number;
  annualOwnership: number;
  fiveYearTco: number;
  inputs: TcoInput;
};

const LS_KEY = "tco_form_v1";

function saveToLS(data: any) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    }
  } catch {}
}

function loadFromLS() {
  try {
    if (typeof window !== "undefined") {
      const v = localStorage.getItem(LS_KEY);
      return v ? JSON.parse(v) : null;
    }
    return null;
  } catch {
    return null;
  }
}
export default function TcoCalculator({
  open,
  onOpenChange,
  products,
  onDone,
  initialInputs,
  onBack,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: Product[];
  onDone: (results: TcoResult[]) => void;
  initialInputs?: TcoInput[];
  onBack?: () => void;
}) {
  const num = (v: any) => {
    if (v == null) return NaN;
    if (typeof v === "number") return v;
    const cleaned = String(v).replace(/[,₹\s]/g, "");
    const m = cleaned.match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };
  const kmNumber = (s?: string) => num(s?.replace(/[^\d.]/g, ""));
  const priceNumber = (s?: string | number) => num(s);

  const defaultFor = (p: Product): TcoInput => {
    const vehiclePrice = priceNumber(p.price) || 0;
    const mileage = kmNumber(p.mileage) || 1; // avoid 0 -> div/0
    const tyreLife = kmNumber(p.tyreLife) || 10000;
    const tyresCost = priceNumber(p.tyresCost) || 0;

    return {
      vehiclePrice,
      loanAmount: vehiclePrice > 0 ? Math.round(vehiclePrice * 0.9) : 0,
      interestRate: 10,
      tenureYears: 4,
      downPayment: vehiclePrice > 0 ? Math.round(vehiclePrice * 0.1) : 0,
      monthlyRunning: 3000,
      mileage,
      fuelPrice: 95,
      monthlyMaintenance: 2500,
      insuranceYear: 40000,
      tyresCost,
      tyreLife,
      resalePct5yr: 25,
    };
  };

  const seed = () => {
    // Try restore for same product set
    const saved = loadFromLS();

    if (
      saved &&
      Array.isArray(saved.form) &&
      saved.products &&
      JSON.stringify(saved.products) ===
        JSON.stringify(products.map((p) => p._id))
    ) {
      return saved.form;
    }

    // Else fresh defaults
    if (initialInputs && initialInputs.length === products.length) {
      return initialInputs;
    }

    return products.map(defaultFor);
  };

  const [tab, setTab] = useState<string>("0");
  const [form, setForm] = useState<TcoInput[]>(() => seed());
  const [errors, setErrors] = useState<
    Record<number, Partial<Record<keyof TcoInput, string>>>
  >({});

  // Keep form length in sync after products/initialInputs change
  useEffect(() => {
    const seeded = seed();
    setForm(seeded);
    setErrors({});
    setTab("0");

    saveToLS({
      form: seeded,
      products: products.map((p) => p._id),
    });
  }, [
    JSON.stringify(products.map((p) => p._id)),
    JSON.stringify(initialInputs || []),
  ]);

  const setField = (i: number, key: keyof TcoInput, value: string) => {
    const v = value === "" ? NaN : Number(value);

    setForm((prev) => {
      const copy = [...prev];
      copy[i] = { ...(copy[i] ?? defaultFor(products[i])), [key]: v };

      if (key === "vehiclePrice") {
        const customPrices = JSON.parse(
          localStorage.getItem("customPrices") || "{}"
        );
        customPrices[products[i]._id] = v; // store the edited price
        localStorage.setItem("customPrices", JSON.stringify(customPrices));
      }
      // Save persistently
      saveToLS({
        form: copy,
        products: products.map((p) => p._id),
      });

      return copy;
    });
  };

  const validateOne = () => true;
  const validateAll = () => true;

  const calc = (i: number) => {
    const f = form[i] ?? defaultFor(products[i]);
    const r = f.interestRate / 100 / 12;
    const n = Math.max(1, f.tenureYears * 12);
    const monthlyEmi =
      r === 0
        ? f.loanAmount / n
        : Math.round(
            (f.loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
          );

    const monthlyFuel =
      (f.monthlyRunning / Math.max(1e-6, f.mileage)) * f.fuelPrice;
    const monthlyInsurance = f.insuranceYear / 12;
    const monthlyTyre =
      (f.monthlyRunning / Math.max(1, f.tyreLife)) * f.tyresCost;

    const monthlyOwnership =
      monthlyEmi +
      monthlyFuel +
      f.monthlyMaintenance +
      monthlyInsurance +
      monthlyTyre;
    const costPerKm = monthlyOwnership / Math.max(1, f.monthlyRunning);
    const annualOwnership = monthlyOwnership * 12;
    const fiveYearTco =
      annualOwnership * 5 - (f.resalePct5yr / 100) * f.vehiclePrice;

    return {
      monthlyEmi,
      monthlyFuel,
      monthlyInsurance,
      monthlyTyre,
      monthlyMaintenance: f.monthlyMaintenance,
      monthlyOwnership,
      costPerKm,
      annualOwnership,
      fiveYearTco,
    };
  };

  const onSubmit = () => {
    if (!validateAll()) return;
    const results: TcoResult[] = products.map((p, i) => {
      const res = calc(i);
      const f = form[i] ?? defaultFor(p);
      return {
        productId: p._id,
        productTitle: p.title,
        ...res,
        inputs: f,
      };
    });
    onDone(results);
    onOpenChange(false);
  };

  const currency = (n: number) =>
    isFinite(n)
      ? n.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        })
      : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Render the heavy content ONLY when open to avoid transient mismatch crashes */}
      {open && (
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black text-white border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Total Cost of Operation (TCO)
            </DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="bg-gray-900 border border-gray-800">
              {products.map((p, i) => (
                <TabsTrigger
                  key={p._id}
                  value={String(i)}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {p.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {products.map((p, i) => {
              const f = form[i] ?? defaultFor(p);
              const e = errors[i] || {};
              return (
                <TabsContent key={p._id} value={String(i)} className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Field
                        label="Vehicle Price (₹)"
                        value={f.vehiclePrice}
                        onChange={(v) => setField(i, "vehiclePrice", v)}
                        error={e.vehiclePrice}
                      />
                      <Field
                        label="Loan Amount (₹)"
                        value={f.loanAmount}
                        onChange={(v) => setField(i, "loanAmount", v)}
                        error={e.loanAmount}
                      />
                      <Field
                        label="Interest Rate (% annual)"
                        value={f.interestRate}
                        onChange={(v) => setField(i, "interestRate", v)}
                        error={e.interestRate}
                      />
                      <Field
                        label="Tenure (years)"
                        value={f.tenureYears}
                        onChange={(v) => setField(i, "tenureYears", v)}
                        error={e.tenureYears}
                      />
                      <Field
                        label="Down Payment (₹)"
                        value={f.downPayment}
                        onChange={(v) => setField(i, "downPayment", v)}
                        error={e.downPayment}
                      />
                      <Field
                        label="Monthly Running (km)"
                        value={f.monthlyRunning}
                        onChange={(v) => setField(i, "monthlyRunning", v)}
                        error={e.monthlyRunning}
                      />
                    </div>

                    <div className="space-y-4">
                      <Field
                        label={`Mileage (${
                          p.fuelType?.toLowerCase() === "cng" ||
                          p.fuelType?.toLowerCase() === "electric"
                            ? "km/kg"
                            : "km/litre"
                        })`}
                        value={f.mileage}
                        onChange={(v) => setField(i, "mileage", v)}
                        error={e.mileage}
                      />
                      <Field
                        label="Fuel Price (₹ per litre/kg)"
                        value={f.fuelPrice}
                        onChange={(v) => setField(i, "fuelPrice", v)}
                        error={e.fuelPrice}
                      />
                      <Field
                        label="Monthly Maintenance (₹)"
                        value={f.monthlyMaintenance}
                        onChange={(v) => setField(i, "monthlyMaintenance", v)}
                        error={e.monthlyMaintenance}
                      />
                      <Field
                        label="Insurance (₹/year)"
                        value={f.insuranceYear}
                        onChange={(v) => setField(i, "insuranceYear", v)}
                        error={e.insuranceYear}
                      />
                      <Field
                        label="Tyres (₹/set)"
                        value={f.tyresCost}
                        onChange={(v) => setField(i, "tyresCost", v)}
                        error={e.tyresCost}
                      />
                      <Field
                        label="Tyre Life (km)"
                        value={f.tyreLife}
                        onChange={(v) => setField(i, "tyreLife", v)}
                        error={e.tyreLife}
                      />
                      <Field
                        label="Resale Value after 5 years (%)"
                        value={f.resalePct5yr}
                        onChange={(v) => setField(i, "resalePct5yr", v)}
                        error={e.resalePct5yr}
                      />
                    </div>
                  </div>

                  {/* ---- RESULTS: upgraded UI ---- */}
                  <div className="mt-8 rounded-2xl border border-gray-800 p-6 bg-gradient-to-b from-gray-950 to-black/60">
                    {(() => {
                      const {
                        monthlyEmi,
                        monthlyFuel,
                        monthlyInsurance,
                        monthlyTyre,
                        monthlyMaintenance,
                        monthlyOwnership,
                        costPerKm,
                        annualOwnership,
                        fiveYearTco,
                      } = calc(i);
                      return (
                        <>
                          {/* KPIs */}
                          <div className="grid gap-4 sm:grid-cols-3">
                            <KPI
                              label="Total Monthly Cost"
                              value={currency(monthlyOwnership)}
                              caption="All-in ownership"
                            />
                            <KPI
                              label="Cost per KM"
                              value={
                                isFinite(costPerKm)
                                  ? `₹ ${costPerKm.toFixed(2)}`
                                  : "—"
                              }
                              caption="Monthly ÷ running"
                            />
                            <KPI
                              label="5-Year TCO"
                              value={currency(fiveYearTco)}
                              caption="After resale value"
                            />
                          </div>

                          <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

                          {/* Breakdown */}
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-xl bg-gray-900/40 border border-gray-800 p-4">
                              <h4 className="text-sm font-semibold text-gray-300 mb-4">
                                Monthly Breakdown
                              </h4>
                              <Metric k="EMI" v={currency(monthlyEmi)} />
                              <Metric k="Fuel" v={currency(monthlyFuel)} />
                              <Metric
                                k="Insurance"
                                v={currency(monthlyInsurance)}
                              />
                              <Metric k="Tyres" v={currency(monthlyTyre)} />
                              <Metric
                                k="Maintenance"
                                v={currency(monthlyMaintenance)}
                              />
                            </div>

                            <div className="rounded-xl bg-gray-900/40 border border-gray-800 p-4">
                              <h4 className="text-sm font-semibold text-gray-300 mb-4">
                                Totals
                              </h4>
                              <Metric
                                k="Total Monthly Cost"
                                v={currency(monthlyOwnership)}
                              />
                              <Metric
                                k="Annual Ownership"
                                v={currency(annualOwnership)}
                              />
                              <Metric
                                k="5-Year TCO"
                                v={currency(fiveYearTco)}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="mt-6 flex justify-between gap-3 pt-4 border-t border-gray-800">
            {onBack && (
              <Button
                variant="outline"
                className="border-gray-700 text-black hover:bg-gray-800 hover:text-white"
                onClick={onBack}
              >
                Back
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="outline"
              className="border-gray-700 text-black hover:bg-gray-800 hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSubmit}
            >
              Save & Continue to Profit
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}

function Field({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-300 font-medium mb-2 block">
        {label}
      </label>

      <Input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
      />
    </div>
  );
}

/* --- New helpers for prettier results --- */
function KPI({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 ring-1 ring-blue-500/30">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-blue-400">{value}</div>
      {caption && (
        <div className="text-[11px] text-gray-500 mt-1">{caption}</div>
      )}
    </div>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-400 text-sm">{k}</span>
      <span className="text-white font-medium">{v}</span>
    </div>
  );
}
