import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products"; // Assuming same dataset
import { Link } from "react-router-dom";

export default function ProductDisplay() {
  // Pick only 3 products
  const featured = categories.slice(0, 3);

  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
            Our Trucks
          </h2>
        </header>

        {/* Product Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {featured.map((c) => (
            <Card
              key={c.key}
              className="bg-black border-0 rounded-none text-left shadow-none"
            >
              {/* Title + Desc */}
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-extrabold text-white uppercase">
                  {c.title}
                </CardTitle>
                <p className="text-gray-300 text-sm leading-relaxed mt-2">
                  {c.description}
                </p>
              </CardHeader>

              {/* Image */}
              <div className="mb-6">
                <img
                  src={c.image}
                  alt={`${c.title} vehicle`}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Specs */}
              <CardContent className="p-0 text-gray-300 text-sm space-y-2 mb-6">
                <p>
                  <span className="font-semibold text-white">ENGINE:</span>{" "}
                  {c.engine}
                </p>
                <p>
                  <span className="font-semibold text-white">FUEL TYPES:</span>{" "}
                  {c.fuel}
                </p>
                <p>
                  <span className="font-semibold text-white">GVW:</span> {c.gvw}
                </p>
                <p>
                  <span className="font-semibold text-white">PAYLOAD:</span>{" "}
                  {c.payload}
                </p>
              </CardContent>

              {/* Button */}
              <div>
                <Link to={`/products/${c.key}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 rounded-sm">
                    Explore {c.title}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
