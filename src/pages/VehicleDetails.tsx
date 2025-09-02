// src/pages/VehicleDetails.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";
import { getProductById } from "@/services/product";

export default function VehicleDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "specs" | "reviews" | "testimonials"
  >("overview");

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => setProduct(data))
        .catch((err) => console.error("Error loading product:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>{`${product.title} | Vikramshila Automobiles`}</title>
        <meta
          name="description"
          content={`${product.title} specifications, price and brochure.`}
        />
        <link rel="canonical" href={`/products/${product._id}`} />
      </Helmet>

      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-72 md:h-[26rem] object-cover"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-gray-400">{product.description}</p>

            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
              <div className="text-sm text-gray-400">Starting Price</div>
              <div className="text-3xl font-bold mt-1">{product.price}</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                  onClick={() => openEnquiryDialog(product.title)}
                >
                  Enquire Now
                </Button>
                {product.brochureFile && (
                  <a
                    href={product.brochureFile.replace("\\", "/")}
                    target="_blank"
                  >
                    <Button className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-6">
                      Download Brochure
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="mt-12">
          <div className="flex gap-6 border-b border-gray-700">
            {["overview", "specs", "reviews", "testimonials"].map((tab) => (
              <button
                key={tab}
                className={`pb-3 capitalize ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                    : "text-gray-400"
                }`}
                onClick={() =>
                  setActiveTab(
                    tab as "overview" | "specs" | "reviews" | "testimonials"
                  )
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="mt-6 text-gray-300">
              {product.overview || product.description}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.gvw && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">GVW</h3>
                  <p className="text-lg font-semibold">{product.gvw}</p>
                </div>
              )}
              {product.engine && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Engine</h3>
                  <p className="text-lg font-semibold">{product.engine}</p>
                </div>
              )}
              {product.fuelTankCapacity && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Fuel Tank Capacity</h3>
                  <p className="text-lg font-semibold">
                    {product.fuelTankCapacity}
                  </p>
                </div>
              )}
              {product.fuelType && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Fuel Type</h3>
                  <p className="text-lg font-semibold">{product.fuelType}</p>
                </div>
              )}
              {product.gearBox && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Gear Box</h3>
                  <p className="text-lg font-semibold">{product.gearBox}</p>
                </div>
              )}
              {product.clutchDia && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Clutch Diameter</h3>
                  <p className="text-lg font-semibold">{product.clutchDia}</p>
                </div>
              )}
              {product.torque && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Torque</h3>
                  <p className="text-lg font-semibold">{product.torque}</p>
                </div>
              )}
              {product.tyre && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Tyre</h3>
                  <p className="text-lg font-semibold">{product.tyre}</p>
                </div>
              )}
              {product.cabinType && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Cabin Type</h3>
                  <p className="text-lg font-semibold">{product.cabinType}</p>
                </div>
              )}
              {product.warranty && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Warranty</h3>
                  <p className="text-lg font-semibold">{product.warranty}</p>
                </div>
              )}
              {product.payload && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Payload</h3>
                  <p className="text-lg font-semibold">{product.payload}</p>
                </div>
              )}
              {product.deckWidth?.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Deck Width</h3>
                  <p className="text-lg font-semibold">
                    {product.deckWidth.join(", ")}
                  </p>
                </div>
              )}
              {product.deckLength?.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Deck Length</h3>
                  <p className="text-lg font-semibold">
                    {product.deckLength.join(", ")}
                  </p>
                </div>
              )}
              {product.bodyDimensions && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Body Dimensions</h3>
                  <p className="text-lg font-semibold">
                    {product.bodyDimensions}
                  </p>
                </div>
              )}
              {product.applicationSuitability && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">
                    Application Suitability
                  </h3>
                  <p className="text-lg font-semibold">
                    {product.applicationSuitability}
                  </p>
                </div>
              )}
              {product.tco && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">TCO</h3>
                  <p className="text-lg font-semibold">{product.tco}</p>
                </div>
              )}
              {product.profitMargin && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">Profit Margin</h3>
                  <p className="text-lg font-semibold">
                    {product.profitMargin}
                  </p>
                </div>
              )}
              {product.usp?.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow">
                  <h3 className="text-sm text-gray-400">USP</h3>
                  <p className="text-lg font-semibold">
                    {product.usp.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="mt-6 space-y-6">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-700"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{review.customerName}</h3>
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-400">{review.customerLocation}</p>
                    <p className="mt-2">{review.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No reviews available</p>
              )}
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="mt-6 space-y-6">
              {product.testimonials?.length > 0 ? (
                product.testimonials.map((t: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-700"
                  >
                    <h3 className="font-semibold">{t.customerName}</h3>
                    <p className="text-gray-400">{t.customerDesignation}</p>
                    <p className="text-gray-500">{t.customerLocation}</p>
                    {t.type === "video" ? (
                      <video
                        src={t.file}
                        controls
                        className="mt-4 w-full rounded-lg"
                      />
                    ) : (
                      <img
                        src={t.file}
                        alt={t.customerName}
                        className="mt-4 w-full rounded-lg"
                      />
                    )}
                    <p className="mt-2">{t.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No testimonials available</p>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
