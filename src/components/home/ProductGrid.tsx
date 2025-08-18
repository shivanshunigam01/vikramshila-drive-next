import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/products";
import { Link } from "react-router-dom";

export default function ProductGrid() {
  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-14 text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
            Our Products
          </h2>
        </header>

        {/* Product Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((c) => (
            <Card
              key={c.key}
              className="bg-black border-0 rounded-none text-left shadow-none"
            >
              {/* Title + Desc */}
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-white uppercase">
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
                  alt={`${c.title} category vehicles`}
                  className="w-full h-52 object-cover rounded-md"
                  loading="lazy"
                />
              </div>

              {/* Specs */}
              <CardContent className="p-0 text-gray-300 text-sm space-y-1 mb-6">
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
                <Link to="/products">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-sm">
                    Explore {c.title} →
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
