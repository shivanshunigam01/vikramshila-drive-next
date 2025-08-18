import { useParams } from "react-router-dom";
import { vehicles } from "@/data/products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import FinanceCalculator from "@/components/home/FinanceCalculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";

export default function VehicleDetails() {
  const { slug } = useParams();
  const v = vehicles.find((x) => x.slug === slug);
  if (!v)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Vehicle not found
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>{`${v.name} | Vikramshila Automobiles`}</title>
        <meta
          name="description"
          content={`${v.name} specifications, variants, price and brochure.`}
        />
        <link rel="canonical" href={`/products/${v.slug}`} />
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="relative w-full">
          <div className="relative rounded-2xl overflow-hidden max-w-7xl mx-auto px-4 md:px-6">
            <img
              src={v.images[0]}
              alt={`${v.name} hero image`}
              className="w-full h-64 md:h-[28rem] object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <h1 className="text-3xl md:text-5xl font-bold">{v.name}</h1>
            </div>
          </div>
        </section>

        {/* Details + Sidebar */}
        <section className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 py-12 px-4 md:px-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-10">
            <p className="text-gray-300">{v.description}</p>

            {/* Image Carousel */}
            <Carousel>
              <CarouselContent>
                {v.images.map((img, i) => (
                  <CarouselItem key={i}>
                    <div className="rounded-2xl overflow-hidden">
                      <img
                        src={img}
                        alt={`${v.name} gallery ${i + 1}`}
                        className="w-full h-72 md:h-[22rem] object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Specifications */}
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {v.specs.map((s) => (
                  <div
                    key={s.key}
                    className="flex justify-between border-b border-gray-700 py-2"
                  >
                    <span className="text-gray-400">{s.key}</span>
                    <span className="font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants */}
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Variants</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {v.variants.map((varn) => (
                  <li
                    key={varn}
                    className="rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 hover:bg-gray-700 transition"
                  >
                    {varn}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-lg">
              <div className="text-sm text-gray-400">Starting Price</div>
              <div className="text-3xl font-bold mt-1">
                ₹ {v.price.toLocaleString("en-IN")}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={v.brochureUrl || "#"}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2">
                    Download Brochure
                  </Button>
                </a>
                <a href={v.priceListUrl || "#"}>
                  <Button
                    variant="outline"
                    className="bg-sky-400 text-black hover:bg-yellow-400 shadow-md transition-colors"
                  >
                    Price List
                  </Button>
                </a>
              </div>
            </div>

            {/* <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 shadow-lg">
              <FinanceCalculator initialPrice={v.price} />
            </div> */}
          </aside>
        </section>

        {/* Mobile CTA */}
        <div className="fixed bottom-0 inset-x-0 bg-gray-900/95 backdrop-blur border-t border-gray-700 p-3 flex gap-3 justify-center md:hidden">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
            onClick={() => openEnquiryDialog(v.name)}
          >
            Enquire Now
          </Button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
