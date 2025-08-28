// src/pages/VehicleDetails.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";
import { getProductById } from "@/services/product";

export default function VehicleDetails() {
  const { id } = useParams(); // 👈 route param should be :id
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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

      <main>
        {/* Hero */}
        <section className="relative w-full">
          <div className="relative rounded-2xl overflow-hidden max-w-7xl mx-auto px-4 md:px-6">
            <img
              src={product.images?.[0]}
              alt={`${product.title} hero image`}
              className="w-full h-64 md:h-[28rem] object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <h1 className="text-3xl md:text-5xl font-bold">
                {product.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Details + Sidebar */}
        <section className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 py-12 px-4 md:px-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-10">
            <p className="text-gray-300">{product.description}</p>

            {/* Image Carousel */}
            {product.images?.length > 0 && (
              <Carousel>
                <CarouselContent>
                  {product.images.map((img: string, i: number) => (
                    <CarouselItem key={i}>
                      <div className="rounded-2xl overflow-hidden">
                        <img
                          src={img}
                          alt={`${product.title} gallery ${i + 1}`}
                          className="w-full h-72 md:h-[22rem] object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}

            {/* Specifications */}
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.gvw && (
                  <div className="flex justify-between border-b border-gray-700 py-2">
                    <span className="text-gray-400">Gross Vehicle Weight</span>
                    <span className="font-semibold">{product.gvw}</span>
                  </div>
                )}
                {product.engine && (
                  <div className="flex justify-between border-b border-gray-700 py-2">
                    <span className="text-gray-400">Engine</span>
                    <span className="font-semibold">{product.engine}</span>
                  </div>
                )}
                {product.fuelTankCapacity && (
                  <div className="flex justify-between border-b border-gray-700 py-2">
                    <span className="text-gray-400">Fuel Tank Capacity</span>
                    <span className="font-semibold">
                      {product.fuelTankCapacity}
                    </span>
                  </div>
                )}
                {product.category && (
                  <div className="flex justify-between border-b border-gray-700 py-2">
                    <span className="text-gray-400">Category</span>
                    <span className="font-semibold">{product.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-lg">
              <div className="text-sm text-gray-400">Starting Price</div>
              <div className="text-3xl font-bold mt-1">{product.price}</div>

              <div className="mt-6 flex flex-wrap gap-3">
                {product.brochureFile && (
                  <a
                    href={product.brochureFile.replace("\\", "/")}
                    target="_blank"
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2">
                      Download Brochure
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </section>

        {/* Mobile CTA */}
        <div className="fixed bottom-0 inset-x-0 bg-gray-900/95 backdrop-blur border-t border-gray-700 p-3 flex gap-3 justify-center md:hidden">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
            onClick={() => openEnquiryDialog(product.title)}
          >
            Enquire Now
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
