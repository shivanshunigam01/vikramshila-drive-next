import { getProductById } from "@/services/product";
import { getCompetitionProductById } from "@/services/competitionService";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  brand?: string;
  type?: "Tata" | "Competitor";
  images?: string[];
  engine?: string;
  torque?: string;
  clutchDia?: string;
  tyre?: string;
  drivercomfort?: string;
  payload?: string;
  fuelType?: string;
  warranty?: string;
}

function formatINR(n: any) {
  if (!n || isNaN(Number(n))) return "—";
  return Number(n).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function ProductComparison4() {
  const navigate = useNavigate();
  const { productIds } = useParams<{ productIds: string }>();
  const location = useLocation();

  const [real, setReal] = useState<Product[]>([]);
  const [competitors, setCompetitors] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [invalidIds, setInvalidIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productIds) return;
      setLoading(true);

      try {
        const ids = productIds.split(",").filter(Boolean);
        const idMap =
          (location.state as { idMap?: { id: string; type: string }[] })
            ?.idMap || [];

        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const type =
              idMap.find((x) => x.id === id)?.type ||
              (id.startsWith("68e") ? "Competitor" : "Tata");

            console.log(`🔍 Fetching ${id} as ${type}`);
            return type === "Competitor"
              ? await getCompetitionProductById(id)
              : await getProductById(id);
          })
        );

        const valid = results
          .filter((r) => r.status === "fulfilled" && r.value?._id)
          .map((r) => (r as PromiseFulfilledResult<any>).value);

        setReal(valid.filter((p) => p.type !== "Competitor"));
        setCompetitors(valid.filter((p) => p.type === "Competitor"));
      } catch (err) {
        console.error("❌ Failed to fetch comparison products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productIds, location.state]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  if (real.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-2">No Tata Vehicle Found</h1>
        <p className="text-gray-400 mb-6">
          Ensure at least one Tata vehicle is included in your selection.
        </p>
        {invalidIds.length > 0 && (
          <p className="text-xs text-red-400 mb-3">
            Skipped invalid product IDs: {invalidIds.join(", ")}
          </p>
        )}
        <Button
          onClick={() => navigate("/products")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  const baseVehicle = real[0];
  const comparisonList = competitors.slice(0, 3);

  const goToReview = (product: Product) => {
    navigate("/review", { state: { product, from: "comparison4" } });
  };

  const ComparisonRow = ({
    label,
    value1,
    competitors,
  }: {
    label: string;
    value1?: string;
    competitors: (string | undefined)[];
  }) => (
    <tr className="border-b border-white/10 hover:bg-white/5 transition">
      <td className="px-3 py-2 text-xs uppercase text-gray-400">{label}</td>
      <td className="px-3 py-2 text-white font-medium">{value1 ?? "—"}</td>
      {competitors.map((v, i) => (
        <td key={i} className="px-3 py-2 text-gray-200">
          {v ?? "—"}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>Compare Vehicles | Vikramshila Automobiles</title>
      </Helmet>
      <Header />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Tata Vehicle vs Competitors
        </h1>

        {invalidIds.length > 0 && (
          <div className="bg-red-900/30 border border-red-500/40 text-red-300 p-3 rounded mb-6 text-sm">
            ⚠️ Some product IDs were invalid and skipped:{" "}
            {invalidIds.join(", ")}
          </div>
        )}

        {/* Header Cards */}
        <div
          className={`grid grid-cols-${1 + comparisonList.length} gap-4 mb-10`}
        >
          {/* Tata Vehicle */}
          <Card className="bg-gray-900 border border-gray-700">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {baseVehicle?.title ?? "—"}
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  Tata
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={baseVehicle.images?.[0]}
                alt={baseVehicle?.title ?? "Tata"}
                className="w-full h-40 object-contain rounded mb-3"
              />
              <p className="text-gray-400 text-sm mb-3">
                {baseVehicle.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {formatINR(baseVehicle.price)}
                </span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">
                  {baseVehicle.category}
                </span>
              </div>
              <Button
                onClick={() => goToReview(baseVehicle)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Proceed to Review
              </Button>
            </CardContent>
          </Card>

          {/* Competitors */}
          {comparisonList.map((c, idx) => (
            <Card
              key={c?._id || idx}
              className="bg-gray-900 border border-gray-700 hover:border-gray-600 transition"
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {c?.title ?? "—"}
                  <span className="text-xs bg-rose-600 text-white px-2 py-1 rounded">
                    Competitor {idx + 1}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={c.images?.[0]}
                  alt={c?.title ?? "Competitor"}
                  className="w-full h-40 object-contain rounded mb-3"
                />
                <p className="text-gray-400 text-sm mb-3">{c?.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{formatINR(c?.price)}</span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">
                    {c?.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="bg-gray-900 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Specification Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs text-gray-400">
                      Specs
                    </th>
                    <th className="px-3 py-2 text-left">
                      {baseVehicle?.title ?? "Tata"}
                    </th>
                    {comparisonList.map((v, i) => (
                      <th key={i} className="px-3 py-2 text-left">
                        {v?.title ?? "—"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow
                    label="Payload"
                    value1={baseVehicle.payload}
                    competitors={comparisonList.map((v) => v.payload)}
                  />
                  <ComparisonRow
                    label="Engine"
                    value1={baseVehicle.engine}
                    competitors={comparisonList.map((v) => v.engine)}
                  />
                  <ComparisonRow
                    label="Torque"
                    value1={baseVehicle.torque}
                    competitors={comparisonList.map((v) => v.torque)}
                  />
                  <ComparisonRow
                    label="Fuel Type"
                    value1={baseVehicle.fuelType}
                    competitors={comparisonList.map((v) => v.fuelType)}
                  />
                  <ComparisonRow
                    label="Tyre"
                    value1={baseVehicle.tyre}
                    competitors={comparisonList.map((v) => v.tyre)}
                  />
                  <ComparisonRow
                    label="Clutch Dia"
                    value1={baseVehicle.clutchDia}
                    competitors={comparisonList.map((v) => v.clutchDia)}
                  />
                  <ComparisonRow
                    label="Warranty"
                    value1={baseVehicle.warranty}
                    competitors={comparisonList.map((v) => v.warranty)}
                  />
                  <ComparisonRow
                    label="Driver Comfort"
                    value1={baseVehicle.drivercomfort}
                    competitors={comparisonList.map((v) => v.drivercomfort)}
                  />
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
