import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/productService";

export default function ProductDisplay() {
  const [products, setProducts] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          const seen = new Set();
          const uniqueCategoryProducts = res.data.data.filter((item) => {
            if (!seen.has(item.category)) {
              seen.add(item.category);
              return true;
            }
            return false;
          });
          setProducts(uniqueCategoryProducts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide uppercase">
            Our Products
          </h2>
        </header>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((c) => (
            <Card
              key={c._id}
              className="flex flex-col bg-black border-0 shadow-none text-left h-full"
            >
              {/* Title + Description */}
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-white uppercase">
                  {c.title}
                </h3>
                <p
                  className={`text-gray-300 text-sm leading-relaxed mt-2 ${
                    expanded[c._id] ? "" : "line-clamp-2"
                  }`}
                >
                  {c.description}
                </p>
                {c.description?.length > 120 && (
                  <button
                    onClick={() => toggleExpand(c._id)}
                    className="text-blue-500 text-xs font-semibold hover:underline mt-1"
                  >
                    {expanded[c._id] ? "See Less" : "See More"}
                  </button>
                )}
              </div>

              {/* Product Image */}
              <div className="mb-6">
                <img
                  src={c.images?.[0]}
                  alt={c.title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Specs Section */}
              <div className="text-gray-300 text-sm space-y-2 mb-6">
                <p>
                  <span className="font-semibold text-white">ENGINE:</span>{" "}
                  {c.engine || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">FUEL TYPES:</span>{" "}
                  {c.fuelType || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">GVW:</span>{" "}
                  {c.gvw || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">PAYLOAD:</span>{" "}
                  {c.payload || "N/A"}
                </p>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <Link to={`/products/${c._id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 w-full rounded-none">
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
