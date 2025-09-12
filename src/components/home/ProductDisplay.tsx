import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  getProducts,
  downloadBrochureService,
} from "@/services/productService";

export default function ProductDisplay() {
  const [products, setProducts] = useState<any[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data)) {
          const seen = new Set();
          const uniqueCategoryProducts = res.data.data.filter((item: any) => {
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

  const handleDownload = async (p: any) => {
    if (!p?._id || !p?.brochureFile) return;
    try {
      setDownloadingId(p._id);
      const res = await downloadBrochureService(p._id);
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      let filename = "brochure.pdf";
      const cd = res.headers["content-disposition"];
      if (cd) {
        const m = cd.match(/filename="?(.+?)"?$/);
        if (m && m[1]) filename = m[1];
      } else if (p.brochureFile?.originalName) {
        filename = p.brochureFile.originalName;
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Brochure download failed:", err);
      alert("Brochure download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4">
        <header className="mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide uppercase">
            Our Products
          </h2>
        </header>

        {/* Grid of product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p: any) => {
            const image = p.images?.[0];

            return (
              <Card
                key={p._id}
                className="bg-black border border-gray-800 rounded-2xl overflow-hidden group relative
             w-[280px] md:w-[300px]"
              >
                {/* Image wrapper (uniform height & ratio) */}
                <CardHeader className="p-0 overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-black">
                    {image ? (
                      <img
                        src={image}
                        alt={p.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900" />
                    )}
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="p-4 flex flex-col bg-black text-white">
                  {/* Show product title instead of category */}
                  <CardTitle className="text-lg font-semibold mb-3 text-white">
                    {p.title || "Untitled Product"}
                  </CardTitle>

                  {/* 3 spec columns */}
                  <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-300 mb-4">
                    <div>
                      <p className="font-bold text-white">{p.gvw || "—"}</p>
                      <p className="text-xs text-gray-400">Tonnage (GVW)</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        {p.fuelTankCapacity || "—"}
                      </p>
                      <p className="text-xs text-gray-400">Fuel Tank</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">{p.payload || "—"}</p>
                      <p className="text-xs text-gray-400">Payload</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <Link
                      to={`/products/${p._id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-center"
                    >
                      Explore {p.category || "Product"}
                    </Link>

                    {p.brochureFile ? (
                      <button
                        onClick={() => handleDownload(p)}
                        className="flex items-center justify-center w-11 h-11 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white"
                        title="Download brochure"
                      >
                        {downloadingId === p._id ? "…" : "PDF"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-700 text-gray-600 cursor-not-allowed"
                        title="Brochure not available"
                      >
                        PDF
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
