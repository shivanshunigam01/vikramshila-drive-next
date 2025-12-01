// src/pages/VehicleDetails.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";
import { getProductById } from "@/services/product";
import { downloadBrochureService } from "@/services/productService";

import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // optional icon; remove if not using lucide
export default function VehicleDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "specs" | "reviews" | "testimonials"
  >("overview");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => setProduct(data))
        .catch((err) => console.error("Error loading product:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDownloadBrochure = () => {
    if (!product?._id) {
      alert("Brochure not available");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;
    const url = `${API_URL}/products/${product._id}/brochure`;

    window.open(url, "_blank");
  };

  const handleViewBrochure = () => {
    if (!product?._id || !product?.brochureFile) {
      alert("Brochure not available");
      return;
    }

    window.open(`${API_URL}/products/${product._id}/brochure`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>
          {product.title} Price, Specs & EMI in Bihar | Vikramshila Automobiles
        </title>
        <meta
          name="description"
          content={`${product.title} price in Bihar. Payload ${product.payload}, GVW ${product.gvw}, mileage, applications, EMI & brochure download at Vikramshila Automobiles – Authorized Tata Motors CV Dealer.`}
        />

        <meta
          name="keywords"
          content={`tata ${product.title} price bihar, tata ${product.title} on road price, tata ${product.title} mileage, tata ${product.title} gvw payload, tata motors ${product.category} bihar`}
        />
        <meta
          name="description"
          content={
            product.metaDescription ||
            `${product.title} on-road price, payload, GVW, mileage, applications, EMI options and brochure at Vikramshila Automobiles, authorized Tata Motors dealer in Bihar.`
          }
        />
        <link
          rel="canonical"
          href={`https://vikramshilaautomobiles.com/products/${product._id}`}
        />

        {/* OG */}
        <meta
          property="og:title"
          content={`${product.title} | Tata Motors Commercial Vehicle`}
        />
        <meta
          property="og:description"
          content={`Explore ${product.title} specs, price, payload and finance options at Vikramshila Automobiles.`}
        />
        <meta
          property="og:url"
          content={`https://vikramshilaautomobiles.com/products/${product._id}`}
        />
        <meta
          property="og:image"
          content={product.images?.[0] || "/og-banner.jpg"}
        />

        {/* Product / Vehicle structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.images || [],
            description:
              product.metaDescription ||
              product.description ||
              `${product.title} Tata Motors commercial vehicle.`,
            brand: {
              "@type": "Brand",
              name: "Tata Motors",
            },
            category: product.category || "Commercial Vehicle",
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.price
                ? String(product.price).replace(/[^\d.]/g, "")
                : "0",
              availability: "https://schema.org/InStock",
              url: `https://vikramshilaautomobiles.com/products/${product._id}`,
            },
          })}
        </script>
      </Helmet>

      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Back + Breadcrumb */}
        <nav className="px-1 mb-6 flex items-center justify-between">
          {/* Back button (history-aware) */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900/70 hover:bg-gray-800 border border-gray-700 text-gray-200 px-3 py-1.5 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Breadcrumb (Home › All Vehicles) */}
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-500">›</li>
            <li className="text-white font-semibold">Vehicle Details</li>
          </ol>
        </nav>
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-72 md:h-[26rem] object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-vehicle.jpg";
              }}
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-gray-400">{product.description}</p>

            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
              <div className="text-sm text-gray-400">Starting Price</div>
              <div className="text-3xl font-bold mt-1">
                {product.price || "Price on Request"}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                  onClick={() => openEnquiryDialog(product.title)}
                >
                  Enquire Now
                </Button>

                {product.brochureFile && (
                  <Button
                    className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl px-6"
                    onClick={handleDownloadBrochure}
                    disabled={downloading}
                  >
                    {downloading ? "Downloading..." : "Download Brochure"}
                  </Button>
                )}

                {/* {product.brochureFile && (
                  <Button
                    className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl px-6"
                    onClick={handleViewBrochure}
                  >
                    View Brochure
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </section>

        {/* Additional Images Gallery */}
        {product.images && product.images.length > 1 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.images.slice(1).map((image: string, index: number) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden shadow-lg"
                >
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 2}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tabs Section */}
        <section className="mt-12">
          <div className="flex gap-6 border-b border-gray-700 overflow-x-auto">
            {["overview", "specs", "reviews", "testimonials"].map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-2 capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                    : "text-gray-400 hover:text-white"
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
            <div className="mt-6 text-gray-300 space-y-4">
              <p>{product.overview || product.description}</p>

              {product.usp && product.usp.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    {product.usp.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "GVW", value: product.gvw },
                { label: "Engine", value: product.engine },
                {
                  label: "Fuel Tank Capacity",
                  value: product.fuelTankCapacity,
                },
                { label: "Fuel Type", value: product.fuelType },
                { label: "Gear Box", value: product.gearBox },
                { label: "Clutch Diameter", value: product.clutchDia },
                { label: "Torque", value: product.torque },
                { label: "Tyre", value: product.tyre },
                { label: "Cabin Type", value: product.cabinType },
                { label: "Warranty", value: product.warranty },
                { label: "Payload", value: product.payload },
                { label: "Deck Width", value: product.deckWidth?.join(", ") },
                { label: "Deck Length", value: product.deckLength?.join(", ") },
                { label: "Body Dimensions", value: product.bodyDimensions },
                {
                  label: "Application Suitability",
                  value: product.applicationSuitability,
                },
                { label: "TCO", value: product.tco },
                { label: "Profit Margin", value: product.profitMargin },
              ].map(
                (spec, idx) =>
                  spec.value && (
                    <div
                      key={idx}
                      className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow hover:border-gray-600 transition-colors"
                    >
                      <h3 className="text-sm text-gray-400">{spec.label}</h3>
                      <p className="text-lg font-semibold">{spec.value}</p>
                    </div>
                  )
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="mt-6 space-y-6">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{review.customerName}</h3>
                        <p className="text-gray-400 text-sm">
                          {review.customerLocation}
                        </p>
                      </div>
                      {review.rating && (
                        <span className="text-yellow-400 flex">
                          {[...Array(5)].map((_, index) => (
                            <span key={index}>
                              {index < review.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-300">{review.content}</p>
                    {review.file && (
                      <div className="mt-3">
                        {review.type === "video" ? (
                          <video
                            src={review.file}
                            controls
                            className="max-w-full h-64 rounded-lg"
                          />
                        ) : (
                          <img
                            src={review.file}
                            alt={`Review by ${review.customerName}`}
                            className="max-w-full h-64 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No reviews available yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="mt-6 space-y-6">
              {product.testimonials?.length > 0 ? (
                product.testimonials.map((t: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="mb-3">
                      <h3 className="font-semibold">{t.customerName}</h3>
                      <p className="text-blue-400 text-sm">
                        {t.customerDesignation}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {t.customerLocation}
                      </p>
                    </div>
                    {t.file && (
                      <div className="mb-3">
                        {t.type === "video" ? (
                          <video
                            src={t.file}
                            controls
                            className="w-full max-w-md rounded-lg"
                          />
                        ) : (
                          <img
                            src={t.file}
                            alt={t.customerName}
                            className="w-full max-w-md rounded-lg object-cover"
                          />
                        )}
                      </div>
                    )}
                    <p className="text-gray-300">{t.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No testimonials available yet</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
