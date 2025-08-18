import { Button } from "@/components/ui/button";
import { offers } from "@/data/products";
import { useEffect, useState } from "react";

export default function OffersSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % offers.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="w-full bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-10 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Current Schemes & Offers
          </h2>
        </header>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((o, i) => (
            <div
              key={o.title}
              className={`rounded-xl border p-6 shadow-lg transition-all duration-500
                ${
                  i === index
                    ? "bg-[#1e2125] border-blue-600 shadow-blue-900/40 scale-[1.02]"
                    : "bg-[#1e2125] border-gray-800 opacity-60"
                }`}
            >
              <h3 className="text-xl font-semibold text-white">{o.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{o.subtitle}</p>
              <p className="text-xs text-gray-500 mt-2">
                Valid till {o.expires}
              </p>
              <div className="mt-5">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  Claim This Offer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
