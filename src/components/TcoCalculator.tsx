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
  mileage?: string; // e.g. "6 km/l"
  tyresCost?: string | number; // e.g. "60000"
  tyreLife?: string; // e.g. "60000 km"
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

export default function TcoCalculator({
  open,
  onOpenChange,
  products,
  onDone,
  initialInputs,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: Product[]; // expect length 2
  onDone: (results: TcoResult[]) => void;
  initialInputs?: TcoInput[]; // <- NEW
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
    const mileage = kmNumber(p.mileage) || 0;
    const tyreLife = kmNumber(p.tyreLife) || 0;
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
    if (initialInputs && initialInputs.length === products.length) {
      return initialInputs;
    }
    return products.map(defaultFor);
  };

  const [tab, setTab] = useState<string>("0");
  const [form, setForm] = useState<TcoInput[]>(seed());
  const [errors, setErrors] = useState<
    Record<number, Partial<Record<keyof TcoInput, string>>>
  >({});

  useEffect(() => {
    setForm(seed());
    setErrors({});
    setTab("0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(products.map((p) => p._id)),
    JSON.stringify(initialInputs || []),
  ]);

  const setField = (i: number, key: keyof TcoInput, value: string) => {
    const v = value === "" ? NaN : Number(value);
    setForm((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: v };
      return copy;
    });
  };

  const validateOne = (i: number): boolean => {
    const f = form[i];
    const err: Partial<Record<keyof TcoInput, string>> = {};
    const req: (keyof TcoInput)[] = [
      "vehiclePrice",
      "loanAmount",
      "interestRate",
      "tenureYears",
      "downPayment",
      "monthlyRunning",
      "mileage",
      "fuelPrice",
      "monthlyMaintenance",
      "insuranceYear",
      "tyresCost",
      "tyreLife",
      "resalePct5yr",
    ];

    req.forEach((k) => {
      const v = f[k];
      if (typeof v !== "number" || isNaN(v)) err[k] = "Required";
      else if (v < 0) err[k] = "Must be ≥ 0";
    });

    if ((f.loanAmount || 0) + (f.downPayment || 0) > (f.vehiclePrice || 0)) {
      err.loanAmount = "Loan + Down Payment must ≤ Vehicle Price";
      err.downPayment = "Loan + Down Payment must ≤ Vehicle Price";
    }
    if ((f.mileage || 0) === 0) err.mileage = "Mileage must be > 0";
    if ((f.tenureYears || 0) === 0) err.tenureYears = "Tenure must be > 0";
    if ((f.tyreLife || 0) === 0) err.tyreLife = "Tyre life must be > 0";
    if ((f.monthlyRunning || 0) === 0)
      err.monthlyRunning = "Monthly running must be > 0";

    setErrors((prev) => ({ ...prev, [i]: err }));
    return Object.keys(err).length === 0;
  };

  const validateAll = (): boolean => {
    const ok1 = validateOne(0);
    const ok2 = validateOne(1);
    if (!ok1) setTab("0");
    else if (!ok2) setTab("1");
    return ok1 && ok2;
  };

  const calc = (i: number) => {
    const f = form[i];
    const r = f.interestRate / 100 / 12;
    const n = f.tenureYears * 12;
    const monthlyEmi =
      r === 0
        ? f.loanAmount / n
        : Math.round(
            (f.loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
          );

    const monthlyFuel = (f.monthlyRunning / f.mileage) * f.fuelPrice;
    const monthlyInsurance = f.insuranceYear / 12;
    const monthlyTyre = (f.monthlyRunning / f.tyreLife) * f.tyresCost;

    const monthlyOwnership =
      monthlyEmi +
      monthlyFuel +
      f.monthlyMaintenance +
      monthlyInsurance +
      monthlyTyre;
    const costPerKm = monthlyOwnership / f.monthlyRunning;
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
      return {
        productId: p._id,
        productTitle: p.title,
        ...res,
        inputs: form[i],
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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-black text-white border border-gray-800">
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
            const f = form[i];
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
                      label="Resale Value after 5 years (% of Vehicle Price)"
                      value={f.resalePct5yr}
                      onChange={(v) => setField(i, "resalePct5yr", v)}
                      error={e.resalePct5yr}
                    />
                  </div>
                </div>

                <div className="mt-8 rounded-lg border border-gray-800 p-6 bg-gray-950">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      TCO Calculation Results
                    </h3>
                    <div className="h-px bg-gray-800"></div>
                  </div>
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
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                            Monthly Breakdown
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Stat
                              label="Monthly EMI"
                              value={currency(monthlyEmi)}
                              color="blue"
                            />
                            <Stat
                              label="Monthly Fuel Cost"
                              value={currency(monthlyFuel)}
                              color="green"
                            />
                            <Stat
                              label="Monthly Insurance"
                              value={currency(monthlyInsurance)}
                              color="orange"
                            />
                            <Stat
                              label="Monthly Tyre Cost"
                              value={currency(monthlyTyre)}
                              color="purple"
                            />
                            <Stat
                              label="Monthly Maintenance"
                              value={currency(monthlyMaintenance)}
                              color="red"
                            />
                            <Stat
                              label="Total Monthly Cost"
                              value={currency(monthlyOwnership)}
                              color="blue"
                              highlight
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
                            Key Metrics
                          </h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-green-900/30 border border-green-800/50">
                              <div className="text-green-400 text-sm font-medium mb-1">
                                Cost per KM
                              </div>
                              <div className="text-2xl font-bold text-white">
                                {isFinite(costPerKm)
                                  ? `₹ ${costPerKm.toFixed(2)}`
                                  : "—"}
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-900/30 border border-blue-800/50">
                              <div className="text-blue-400 text-sm font-medium mb-1">
                                Annual Ownership
                              </div>
                              <div className="text-2xl font-bold text-white">
                                {currency(annualOwnership)}
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-900/30 border border-purple-800/50">
                              <div className="text-purple-400 text-sm font-medium mb-1">
                                5-Year TCO
                              </div>
                              <div className="text-2xl font-bold text-white">
                                {currency(fiveYearTco)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-800">
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
            Save & Compare
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-300 font-medium mb-2 block">
        {label}
      </label>
      <Input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        }`}
      />
      {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
    </div>
  );
}

function Stat({
  label,
  value,
  color = "gray",
  highlight = false,
}: {
  label: string;
  value: string;
  color?: string;
  highlight?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-900/20 border-blue-800/40 text-blue-400",
    green: "bg-green-900/20 border-green-800/40 text-green-400",
    orange: "bg-orange-900/20 border-orange-800/40 text-orange-400",
    purple: "bg-purple-900/20 border-purple-800/40 text-purple-400",
    red: "bg-red-900/20 border-red-800/40 text-red-400",
    gray: "bg-gray-900/40 border-gray-800/40 text-gray-400",
  };

  return (
    <div
      className={`p-3 rounded-lg border ${colorClasses[color]} ${
        highlight ? "ring-1 ring-blue-500/50 bg-blue-900/30" : ""
      }`}
    >
      <div
        className={`text-xs font-medium mb-1 ${
          highlight ? "text-blue-300" : ""
        }`}
      >
        {label}
      </div>
      <div className={`font-bold text-white ${highlight ? "text-lg" : ""}`}>
        {value}
      </div>
    </div>
  );
}
