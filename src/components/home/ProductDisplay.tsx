// ProductDisplay.tsx
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
          // keep a single representative per category
          const uniqueCategoryProducts = res.data.data.filter((item) => {
            const cat = item.category || "Others";
            if (!seen.has(cat)) {
              seen.add(cat);
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
        <header className="mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide uppercase">
            Our Products
          </h2>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((p) => {
            const category = p.category || "Others";
            return (
              <Card
                key={p._id}
                className="flex flex-col bg-black border-0 shadow-none text-left h-full"
              >
                {/* Title (category) + description */}
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold text-white uppercase">
                    {category}
                  </h3>
                  <p
                    className={`text-gray-300 text-sm leading-relaxed mt-2 ${
                      expanded[p._id] ? "" : "line-clamp-2"
                    }`}
                  >
                    {p.description}
                  </p>
                  {p.description?.length > 120 && (
                    <button
                      onClick={() => toggleExpand(p._id)}
                      className="text-blue-500 text-xs font-semibold hover:underline mt-1"
                    >
                      {expanded[p._id] ? "See Less" : "See More"}
                    </button>
                  )}
                </div>

                {/* Image */}
                <div className="mb-6">
                  <img
                    src={p.images?.[0]}
                    alt={category}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Specs */}
                <div className="text-gray-300 text-sm space-y-2 mb-6">
                  <p>
                    <span className="font-semibold text-white">ENGINE:</span>{" "}
                    {p.engine || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">
                      FUEL TYPES:
                    </span>{" "}
                    {p.fuelType || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">GVW:</span>{" "}
                    {p.gvw || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">PAYLOAD:</span>{" "}
                    {p.payload || "N/A"}
                  </p>
                </div>

                {/* CTA -> goes to Products filtered by category */}
                <div className="mt-auto">
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 w-full rounded-none">
                      Explore {category}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
