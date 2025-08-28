import { Button } from "@/components/ui/button";
import { getSchemes } from "@/services/schemeServices";
import { useEffect, useState } from "react";

export default function OffersSlider() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getSchemes().then((data) => setSchemes(data));
  }, []);

  useEffect(() => {
    if (schemes.length > 0) {
      const t = setInterval(
        () => setIndex((i) => (i + 1) % schemes.length),
        4000
      );
      return () => clearInterval(t);
    }
  }, [schemes]);

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
          {schemes.map((o, i) => (
            <div
              key={o._id}
              className={`rounded-xl border p-6 shadow-lg transition-all duration-500 flex flex-col
                ${
                  i === index
                    ? "bg-[#1e2125] border-blue-600 shadow-blue-900/40 scale-[1.02]"
                    : "bg-[#1e2125] border-gray-800 opacity-60"
                }`}
            >
              {/* Scheme Image */}
              {o.photos?.length > 0 && (
                <img
                  src={o.photos[0]}
                  alt={o.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              {/* Scheme Content */}
              <h3 className="text-xl font-semibold text-white">{o.title}</h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {o.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Valid: {new Date(o.startDate).toLocaleDateString()} -{" "}
                {new Date(o.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
