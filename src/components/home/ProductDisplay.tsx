import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getProducts } from "@/services/productService";

export default function ProductDisplay() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data.slice(0, 3)); // pick only 3
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
            Our Products
          </h2>
        </header>

        {/* Product Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((c) => (
            <Card
              key={c._id}
              className="flex flex-col bg-black border-0 rounded-none text-left shadow-none h-full"
            >
              {/* Title + Desc */}
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-extrabold text-white uppercase">
                  {c.title}
                </CardTitle>
                <p className="text-gray-300 text-sm leading-relaxed mt-2 line-clamp-3">
                  {c.description}
                </p>
                {/* Read More link */}
                {c.description?.length > 120 && (
                  <Link
                    to={`/products/${c._id}`}
                    className="text-blue-500 text-xs font-semibold hover:underline mt-1 inline-block"
                  >
                    Read more
                  </Link>
                )}
              </CardHeader>

              {/* Image */}
              <div className="mb-6">
                <img
                  src={c.images?.[0]}
                  alt={`${c.title} vehicle`}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Specs */}
              <CardContent className="p-0 text-gray-300 text-sm space-y-2 mb-6 flex-grow">
                <p>
                  <span className="font-semibold text-white">CATEGORY:</span>{" "}
                  {c.category}
                </p>
                <p>
                  <span className="font-semibold text-white">PRICE:</span>{" "}
                  {c.price}
                </p>
              </CardContent>

              {/* Button (always bottom aligned) */}
              <div className="mt-auto">
                <Link to={`/products/${c._id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 rounded-sm w-full">
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
