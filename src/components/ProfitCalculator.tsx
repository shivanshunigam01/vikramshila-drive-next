import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** ------ Existing types (unchanged for callers) ------ */
export type ProfitInput = {
  vehiclePrice: number;
  tcoPerKm: number;
  monthlyRunning: number;
  billedPct: number;
  freightRate: number;
  addOnPerKm: number;
  fixedAddOns: number;
  downPayment: number;
  resalePct5yr: number;
  payloadTon?: number;

  /** internal marker when we store passenger inputs in .inputs */
  __passenger?: boolean;

  /** when __passenger === true we stash the raw passenger fields below */
  seats?: number;
  occPct?: number;
  fare?: number;
  tripsPerDay?: number;
  kmPerTrip?: number;
  workDays?: number;
  dieselPrice?: number;
  kmPerLitre?: number;
  driverWageMo?: number;
  conductorWageMo?: number;
  maintPerKm?: number;
  annualPermit?: number;
  busPrice?: number;
  lifeYears?: number;
  residualPct?: number;
};

export type ProfitResult = {
  productId: string;
  productTitle: string;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  breakevenRate: number;
  annualProfit: number;
  fiveYearProfit: number;
  roi5yr: number;
  paybackMonths: number;
  inputs: ProfitInput;
};

type ProductLite = { _id: string; title: string };

/** ------ NEW: passenger inputs (internal only) ------ */
type PassengerInput = {
  seats: number;
  occPct: number; // %
  fare: number; // ₹ per passenger
  tripsPerDay: number;
  kmPerTrip: number;
  workDays: number; // days / month
  dieselPrice: number; // ₹ / litre
  kmPerLitre: number; // mileage
  driverWageMo: number; // ₹ / month
  conductorWageMo: number; // ₹ / month
  maintPerKm: number; // ₹ / km
  annualPermit: number; // ₹ / year (permit+insurance+tax)
  busPrice: number; // ₹
  lifeYears: number; // years
  residualPct: number; // %
};

export default function ProfitCalculator({
  open,
  onOpenChange,
  products,
  onDone,
  initialInputs,
  onBack,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: ProductLite[];
  onDone: (results: ProfitResult[]) => void;
  initialInputs?: ProfitInput[];
  onBack?: () => void;
}) {
  /** ------------ helpers & seeds ------------ */
  const isPassengerTitle = (t: string) => {
    const s = t.toLowerCase();
    return (
      s.includes("bus") ||
      s.includes("winger") ||
      s.includes("scv pickup") ||
      (s.includes("pickup") && s.includes("scv"))
    );
  };

  // Freight seed (your existing)
  const seedFreight = (p: ProductLite): ProfitInput => ({
    vehiclePrice: 1000000,
    tcoPerKm: 15,
    monthlyRunning: 3000,
    billedPct: 85,
    freightRate: 28,
    addOnPerKm: 2,
    fixedAddOns: 3000,
    downPayment: 200000,
    resalePct5yr: 25,
    payloadTon: 1,
  });

  // Passenger seed (aligned to your spreadsheet defaults / example)
  const seedPassenger = (p: ProductLite): PassengerInput => ({
    seats: 44,
    occPct: 100,
    fare: 100,
    tripsPerDay: 4,
    kmPerTrip: 50,
    workDays: 26,
    dieselPrice: 90,
    kmPerLitre: 4.5,
    driverWageMo: 20000,
    conductorWageMo: 15000,
    maintPerKm: 5,
    annualPermit: 150000,
    busPrice: 3500000,
    lifeYears: 8,
    residualPct: 20,
  });

  // Build arrays in correct lengths from optional initialInputs
  const freightFromInitial = (i: number, p: ProductLite): ProfitInput => {
    const ii = initialInputs?.[i];
    if (!ii || ii.__passenger) return seedFreight(p);
    return ii;
  };

  const passengerFromInitial = (i: number, p: ProductLite): PassengerInput => {
    const ii = initialInputs?.[i];
    if (ii?.__passenger) {
      // pull passenger stash
      return {
        seats: ii.seats ?? 44,
        occPct: ii.occPct ?? 100,
        fare: ii.fare ?? 100,
        tripsPerDay: ii.tripsPerDay ?? 4,
        kmPerTrip: ii.kmPerTrip ?? 50,
        workDays: ii.workDays ?? 26,
        dieselPrice: ii.dieselPrice ?? 90,
        kmPerLitre: ii.kmPerLitre ?? 4.5,
        driverWageMo: ii.driverWageMo ?? 20000,
        conductorWageMo: ii.conductorWageMo ?? 15000,
        maintPerKm: ii.maintPerKm ?? 5,
        annualPermit: ii.annualPermit ?? 150000,
        busPrice: ii.busPrice ?? 3500000,
        lifeYears: ii.lifeYears ?? 8,
        residualPct: ii.residualPct ?? 20,
      };
    }
    return seedPassenger(p);
  };

  const [freightForm, setFreightForm] = useState<ProfitInput[]>(
    products.map((p, i) => freightFromInitial(i, p))
  );
  const [passForm, setPassForm] = useState<PassengerInput[]>(
    products.map((p, i) => passengerFromInitial(i, p))
  );
  const [tab, setTab] = useState("0");

  // keep forms in sync with products / initialInputs
  useEffect(() => {
    setFreightForm(products.map((p, i) => freightFromInitial(i, p)));
    setPassForm(products.map((p, i) => passengerFromInitial(i, p)));
    setTab("0");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(products.map((p) => p._id)),
    JSON.stringify(initialInputs || []),
  ]);

  /** ------------ setters ------------ */
  const setFreightField = (
    i: number,
    key: keyof ProfitInput,
    value: string
  ) => {
    const v = value === "" ? NaN : Number(value);
    setFreightForm((prev) => {
      const copy = [...prev];
      copy[i] = { ...(copy[i] ?? seedFreight(products[i])), [key]: v };
      return copy;
    });
  };

  const setPassField = (
    i: number,
    key: keyof PassengerInput,
    value: string
  ) => {
    const v = value === "" ? NaN : Number(value);
    setPassForm((prev) => {
      const copy = [...prev];
      copy[i] = { ...(copy[i] ?? seedPassenger(products[i])), [key]: v as any };
      return copy;
    });
  };

  /** ------------ calculators ------------ */
  // existing freight calculator (unchanged)
  const calcFreight = (fIn?: ProfitInput) => {
    const f = fIn ?? {
      vehiclePrice: 0,
      tcoPerKm: 0,
      monthlyRunning: 0,
      billedPct: 0,
      freightRate: 0,
      addOnPerKm: 0,
      fixedAddOns: 0,
      downPayment: 0,
      resalePct5yr: 0,
      payloadTon: 1,
    };

    const effBilledKm = (f.monthlyRunning || 0) * ((f.billedPct || 0) / 100);
    const payload = f.payloadTon && f.payloadTon > 0 ? f.payloadTon : 1;

    const monthlyRevenue = effBilledKm * (f.freightRate || 0) * payload;
    const monthlyTcoCost = (f.monthlyRunning || 0) * (f.tcoPerKm || 0);
    const addOnVar = (f.monthlyRunning || 0) * (f.addOnPerKm || 0);
    const totalMonthlyCost = monthlyTcoCost + addOnVar + (f.fixedAddOns || 0);
    const monthlyProfit = monthlyRevenue - totalMonthlyCost;

    const breakevenRate =
      effBilledKm > 0 ? totalMonthlyCost / effBilledKm : NaN;
    const annualProfit = monthlyProfit * 12;
    const fiveYearProfit =
      monthlyProfit * 60 +
      ((f.resalePct5yr || 0) / 100) * (f.vehiclePrice || 0);
    const roi5yr =
      (f.downPayment || 0) > 0 ? fiveYearProfit / f.downPayment : NaN;
    const paybackMonths =
      monthlyProfit > 0 ? (f.downPayment || 0) / monthlyProfit : NaN;

    return {
      monthlyRevenue,
      totalMonthlyCost,
      monthlyProfit,
      breakevenRate,
      annualProfit,
      fiveYearProfit,
      roi5yr,
      paybackMonths,
    };
  };

  // NEW: passenger calculator (buses/winger/scv pickup)
  const calcPassenger = (f: PassengerInput) => {
    // derived (daily)
    const dailyKm = (f.kmPerTrip || 0) * (f.tripsPerDay || 0);
    const occ = (f.occPct || 0) / 100;
    const pax = (f.seats || 0) * (f.tripsPerDay || 0) * occ;
    const fuelL = f.kmPerLitre > 0 ? dailyKm / f.kmPerLitre : 0;
    const fuelCostD = fuelL * (f.dieselPrice || 0);
    const maintD = dailyKm * (f.maintPerKm || 0);
    const drvD = (f.driverWageMo || 0) / Math.max(1, f.workDays || 26);
    const conD = (f.conductorWageMo || 0) / Math.max(1, f.workDays || 26);
    const permitD = (f.annualPermit || 0) / 365;
    const depBase = (f.busPrice || 0) * (1 - (f.residualPct || 0) / 100);
    const depD = f.lifeYears > 0 ? depBase / (f.lifeYears * 365) : 0;

    // daily
    const revD = pax * (f.fare || 0);
    const costD = fuelCostD + maintD + drvD + conD + permitD + depD;
    const profitD = revD - costD;

    // monthly
    const days = f.workDays || 26;
    const revM = revD * days;
    const fuelM = fuelCostD * days;
    const maintM = maintD * days;
    const wagesM = (f.driverWageMo || 0) + (f.conductorWageMo || 0);
    const permitM = (f.annualPermit || 0) / 12;
    const depM = f.lifeYears > 0 ? depBase / f.lifeYears / 12 : 0;
    const costM = fuelM + maintM + wagesM + permitM + depM;
    const profitM = revM - costM;

    // for consistency with the freight outputs:
    const monthlyRevenue = revM;
    const totalMonthlyCost = costM;
    const monthlyProfit = profitM;
    const annualProfit = profitM * 12;
    const fiveYearProfit = annualProfit * 5; // resale handled via residual in depreciation; no extra terminal value added here

    // breakeven "fare per billed passenger-km" isn't directly applicable;
    // give a proxy: cost per passenger per day at 100% occupancy rate per trip-km
    const billedPaxKmPerDay = pax * (f.kmPerTrip || 0); // passengers * km per trip (approx)
    const breakevenRate =
      billedPaxKmPerDay > 0 ? costD / billedPaxKmPerDay : NaN;

    // ROI/payback vs down payment if provided (use 20% by default)
    const downPayment = (f.busPrice || 0) * 0.2; // heuristic; you can wire your finance DP here if needed
    const roi5yr = downPayment > 0 ? (fiveYearProfit || 0) / downPayment : NaN;
    const paybackMonths = monthlyProfit > 0 ? downPayment / monthlyProfit : NaN;

    return {
      // daily (for UI if you want)
      dailyKm,
      pax,
      revD,
      costD,
      profitD,

      // monthly & outputs used downstream
      monthlyRevenue,
      totalMonthlyCost,
      monthlyProfit,
      breakevenRate,
      annualProfit,
      fiveYearProfit,
      roi5yr,
      paybackMonths,
      depBase,
    };
  };

  /** ------------ submit ------------ */
  const onSubmit = () => {
    const results: ProfitResult[] = products.map((p, i) => {
      const isPassenger = isPassengerTitle(p.title);
      if (isPassenger) {
        const fin = passForm[i] ?? seedPassenger(p);
        const r = calcPassenger(fin);
        const inputs: ProfitInput = {
          __passenger: true,
          // stash raw passenger fields so re-open works:
          seats: fin.seats,
          occPct: fin.occPct,
          fare: fin.fare,
          tripsPerDay: fin.tripsPerDay,
          kmPerTrip: fin.kmPerTrip,
          workDays: fin.workDays,
          dieselPrice: fin.dieselPrice,
          kmPerLitre: fin.kmPerLitre,
          driverWageMo: fin.driverWageMo,
          conductorWageMo: fin.conductorWageMo,
          maintPerKm: fin.maintPerKm,
          annualPermit: fin.annualPermit,
          busPrice: fin.busPrice,
          lifeYears: fin.lifeYears,
          residualPct: fin.residualPct,

          // fill required freight fields with neutral values
          vehiclePrice: fin.busPrice,
          tcoPerKm: fin.maintPerKm,
          monthlyRunning: fin.workDays * fin.kmPerTrip * fin.tripsPerDay,
          billedPct: fin.occPct,
          freightRate: fin.fare, // semantic mismatch but harmless for reseed marker
          addOnPerKm: 0,
          fixedAddOns: 0,
          downPayment: Math.round((fin.busPrice || 0) * 0.2),
          resalePct5yr: fin.residualPct,
          payloadTon: 1,
        };
        return {
          productId: p._id,
          productTitle: p.title,
          monthlyRevenue: r.monthlyRevenue,
          monthlyCost: r.totalMonthlyCost,
          monthlyProfit: r.monthlyProfit,
          breakevenRate: r.breakevenRate,
          annualProfit: r.annualProfit,
          fiveYearProfit: r.fiveYearProfit,
          roi5yr: r.roi5yr,
          paybackMonths: r.paybackMonths,
          inputs,
        };
      }

      // freight (original)
      const fin = freightForm[i] ?? seedFreight(p);
      const r = calcFreight(fin);
      return {
        productId: p._id,
        productTitle: p.title,
        monthlyRevenue: r.monthlyRevenue,
        monthlyCost: r.totalMonthlyCost,
        monthlyProfit: r.monthlyProfit,
        breakevenRate: r.breakevenRate,
        annualProfit: r.annualProfit,
        fiveYearProfit: r.fiveYearProfit,
        roi5yr: r.roi5yr,
        paybackMonths: r.paybackMonths,
        inputs: fin,
      };
    });

    onDone(results);
    onOpenChange(false);
  };

  /** ------------ UI helpers ------------ */
  const currency = (n: number) =>
    isFinite(n)
      ? n.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        })
      : "—";

  function KPI({
    label,
    value,
    caption,
    tone = "neutral",
  }: {
    label: string;
    value: string;
    caption?: string;
    tone?: "positive" | "negative" | "neutral";
  }) {
    const toneText =
      tone === "positive"
        ? "text-emerald-400"
        : tone === "negative"
        ? "text-red-400"
        : "text-blue-400";
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 ring-1 ring-gray-700/40">
        <div className="text-xs text-gray-400">{label}</div>
        <div className={`mt-1 text-2xl font-bold ${toneText}`}>{value}</div>
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

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void; // parent already expects string
}) {
  const [local, setLocal] = useState<string>(
    Number.isFinite(value) ? String(value) : ""
  );

  // keep in sync if parent value changes (e.g., switching tabs/products)
  useEffect(() => {
    setLocal(Number.isFinite(value) ? String(value) : "");
  }, [value]);

  const commit = () => {
    // send raw string up; parent will parse (your set*Field already handles "")
    onChange(local);
  };

  return (
    <div>
      <label className="text-sm text-gray-300 font-medium mb-2 block">
        {label}
      </label>
      <Input
        type="text"               // allow partial entries like "-", "1.", etc.
        inputMode="decimal"       // mobile shows numeric keypad
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
        }}
        className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
      />
    </div>
  );
}

  /** ------------ render ------------ */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-black text-white border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Profit Calculator
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
              const passenger = isPassengerTitle(p.title);

              if (passenger) {
                const f = passForm[i] ?? seedPassenger(p);
                const r = calcPassenger(f);
                return (
                  <TabsContent key={p._id} value={String(i)} className="mt-6">
                    {/* Passenger inputs */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Field
                          label="Seats"
                          value={f.seats}
                          onChange={(v) => setPassField(i, "seats", v)}
                        />
                        <Field
                          label="Occupancy (%)"
                          value={f.occPct}
                          onChange={(v) => setPassField(i, "occPct", v)}
                        />
                        <Field
                          label="Fare (₹ / passenger)"
                          value={f.fare}
                          onChange={(v) => setPassField(i, "fare", v)}
                        />
                        <Field
                          label="Trips per day"
                          value={f.tripsPerDay}
                          onChange={(v) => setPassField(i, "tripsPerDay", v)}
                        />
                        <Field
                          label="Distance per trip (km)"
                          value={f.kmPerTrip}
                          onChange={(v) => setPassField(i, "kmPerTrip", v)}
                        />
                        <Field
                          label="Working days / month"
                          value={f.workDays}
                          onChange={(v) => setPassField(i, "workDays", v)}
                        />
                        <Field
                          label="Mileage (km / litre)"
                          value={f.kmPerLitre}
                          onChange={(v) => setPassField(i, "kmPerLitre", v)}
                        />
                        <Field
                          label="Diesel price (₹ / litre)"
                          value={f.dieselPrice}
                          onChange={(v) => setPassField(i, "dieselPrice", v)}
                        />
                      </div>
                      <div className="space-y-4">
                        <Field
                          label="Driver wage (₹ / month)"
                          value={f.driverWageMo}
                          onChange={(v) => setPassField(i, "driverWageMo", v)}
                        />
                        <Field
                          label="Conductor wage (₹ / month)"
                          value={f.conductorWageMo}
                          onChange={(v) =>
                            setPassField(i, "conductorWageMo", v)
                          }
                        />
                        <Field
                          label="Maintenance (₹ / km)"
                          value={f.maintPerKm}
                          onChange={(v) => setPassField(i, "maintPerKm", v)}
                        />
                        <Field
                          label="Permit/Insurance/Tax (₹ / year)"
                          value={f.annualPermit}
                          onChange={(v) => setPassField(i, "annualPermit", v)}
                        />
                        <Field
                          label="Bus price (₹)"
                          value={f.busPrice}
                          onChange={(v) => setPassField(i, "busPrice", v)}
                        />
                        <Field
                          label="Life (years)"
                          value={f.lifeYears}
                          onChange={(v) => setPassField(i, "lifeYears", v)}
                        />
                        <Field
                          label="Residual value (%)"
                          value={f.residualPct}
                          onChange={(v) => setPassField(i, "residualPct", v)}
                        />
                      </div>
                    </div>

                    {/* Results UI (colored + KPIs) */}
                    <div className="mt-8 rounded-2xl border border-gray-800 p-6 bg-gradient-to-b from-gray-950 to-black/60">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <KPI
                          label="Monthly Profit"
                          value={currency(r.monthlyProfit)}
                          tone={r.monthlyProfit >= 0 ? "positive" : "negative"}
                          caption="After fuel, wages, permit, depreciation"
                        />
                        <KPI
                          label="Monthly Revenue"
                          value={currency(r.monthlyRevenue)}
                          caption="Passengers × fare × working days"
                        />
                        <KPI
                          label="Total Monthly Cost"
                          value={currency(r.totalMonthlyCost)}
                          caption="Fuel + Maint + Wages + Permit + Dep"
                        />
                      </div>

                      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl bg-gray-900/40 border border-gray-800 p-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-4">
                            Daily Snapshot
                          </h4>
                          <Metric
                            k="Passengers / day"
                            v={`${Math.round(r.pax || 0)}`}
                          />
                          <Metric k="Revenue / day" v={currency(r.revD || 0)} />
                          <Metric k="Cost / day" v={currency(r.costD || 0)} />
                          <Metric
                            k="Profit / day"
                            v={currency(r.profitD || 0)}
                          />
                        </div>
                        <div className="rounded-xl bg-gray-900/40 border border-gray-800 p-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-4">
                            Long-term
                          </h4>
                          <Metric
                            k="Annual Profit"
                            v={currency(r.annualProfit)}
                          />
                          <Metric
                            k="5-Year Profit"
                            v={currency(r.fiveYearProfit)}
                          />
                          <Metric
                            k="ROI (5-year)"
                            v={
                              isFinite(r.roi5yr)
                                ? `${(r.roi5yr * 100).toFixed(1)} %`
                                : "—"
                            }
                          />
                          <Metric
                            k="Payback (months)"
                            v={
                              isFinite(r.paybackMonths)
                                ? r.paybackMonths.toFixed(1)
                                : "—"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              }

              // Freight path (your original UI)
              const f = freightForm[i] ?? seedFreight(p);
              const r = calcFreight(f);
              return (
                <TabsContent key={p._id} value={String(i)} className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Field
                        label="Vehicle Price (₹)"
                        value={f.vehiclePrice}
                        onChange={(v) => setFreightField(i, "vehiclePrice", v)}
                      />
                      <Field
                        label="TCO per km (₹/km)"
                        value={f.tcoPerKm}
                        onChange={(v) => setFreightField(i, "tcoPerKm", v)}
                      />
                      <Field
                        label="Monthly Running (km)"
                        value={f.monthlyRunning}
                        onChange={(v) =>
                          setFreightField(i, "monthlyRunning", v)
                        }
                      />
                      <Field
                        label="Effective Billed (%)"
                        value={f.billedPct}
                        onChange={(v) => setFreightField(i, "billedPct", v)}
                      />
                      <Field
                        label="Freight Rate (₹/ton/km)"
                        value={f.freightRate}
                        onChange={(v) => setFreightField(i, "freightRate", v)}
                      />
                    </div>
                    <div className="space-y-4">
                      <Field
                        label="Add-on Variable (₹/km)"
                        value={f.addOnPerKm}
                        onChange={(v) => setFreightField(i, "addOnPerKm", v)}
                      />
                      <Field
                        label="Fixed Add-ons (₹/month)"
                        value={f.fixedAddOns}
                        onChange={(v) => setFreightField(i, "fixedAddOns", v)}
                      />
                      <Field
                        label="Down Payment (₹)"
                        value={f.downPayment}
                        onChange={(v) => setFreightField(i, "downPayment", v)}
                      />
                      <Field
                        label="Resale after 5 years (%)"
                        value={f.resalePct5yr}
                        onChange={(v) => setFreightField(i, "resalePct5yr", v)}
                      />
                      <Field
                        label="Payload (tons)"
                        value={f.payloadTon || 1}
                        onChange={(v) => setFreightField(i, "payloadTon", v)}
                      />
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-gray-800 p-6 bg-gradient-to-b from-gray-950 to-black/60">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <KPI
                        label="Monthly Profit"
                        value={currency(r.monthlyProfit)}
                        tone={r.monthlyProfit >= 0 ? "positive" : "negative"}
                        caption="Profitable vs costs"
                      />
                      <KPI
                        label="Monthly Revenue"
                        value={currency(r.monthlyRevenue)}
                        caption="Billed km × rate"
                      />
                      <KPI
                        label="Total Monthly Cost"
                        value={currency(r.totalMonthlyCost)}
                        caption="TCO + add-ons"
                      />
                    </div>
                    <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl bg-gray-900/40 border border-gray-800 p-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-4">
                          Unit Economics
                        </h4>
                        <Metric
                          k="Breakeven Rate"
                          v={
                            isFinite(r.breakevenRate)
                              ? `₹ ${r.breakevenRate.toFixed(2)} / billed km`
                              : "—"
                          }
                        />
                        <Metric
                          k="ROI (5-year)"
                          v={
                            isFinite(r.roi5yr)
                              ? `${(r.roi5yr * 100).toFixed(1)} %`
                              : "—"
                          }
                        />
                        <Metric
                          k="Payback"
                          v={
                            isFinite(r.paybackMonths)
                              ? `${r.paybackMonths.toFixed(1)} months`
                              : "—"
                          }
                        />
                      </div>
                      <div className="rounded-xl bg-gray-900/40 border border-gray-800 p-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-4">
                          Long-term View
                        </h4>
                        <Metric
                          k="Annual Profit"
                          v={currency(r.annualProfit)}
                        />
                        <Metric
                          k="5-Year Total (incl. resale)"
                          v={currency(r.fiveYearProfit)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="mt-6 flex justify-between gap-3 pt-4 border-t border-gray-800">
            {onBack ? (
              <Button
                variant="outline"
                className="border-gray-700 text-black hover:bg-gray-800 hover:text-white"
                onClick={onBack}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-gray-700 text-black hover:bg-gray-800 hover:text-white"
                onClick={() => onOpenChange(false)}
              >
                Back
              </Button>
            )}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSubmit}
            >
              Calculate Profit & Continue to Compare
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
