import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts, getProductById } from "@/services/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const filterOptions = [
  {
    label: "Vehicle Type",
    options: ["SCV", "LCV", "ICV", "MCV", "Pickup", "Bus"],
  },
  {
    label: "Applications",
    options: ["Cargo", "Passenger", "Construction", "Mining"],
  },
  { label: "Fuel Type", options: ["Diesel", "CNG", "Electric", "Hybrid"] },
  {
    label: "Price Range",
    options: ["Under ₹5L", "₹5L-₹10L", "₹10L-₹20L", "Above ₹20L"],
  },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFilters, setExpandedFilters] = useState({});
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  const toggleFilter = (filterLabel: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterLabel]: !prev[filterLabel],
    }));
  };

  const handleKnowMore = async (id: string) => {
    try {
      setLoadingProduct(true);
      const product = await getProductById(id);
      setSelectedProduct(product);
    } catch (err) {
      console.error("Failed to fetch product details", err);
    } finally {
      setLoadingProduct(false);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>Products | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Explore Tata commercial vehicles: SCV, Pickup, LCV, ICV, MCV, Winger & Buses."
        />
        <link rel="canonical" href="/products" />
      </Helmet>

      <Header />

      {/* Breadcrumb */}
      <div className="bg-black border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-300">
            <a href="/" className="hover:text-white font-medium">
              Home
            </a>
            <span className="mx-2">›</span>
            <span className="text-white font-semibold">All Vehicles</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-80 bg-gray-900 rounded-lg shadow-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button className="text-blue-500 text-sm hover:underline">
                Reset All
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search vehicles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Options */}
            <div className="space-y-4">
              {filterOptions.map((filter) => (
                <div
                  key={filter.label}
                  className="border-b border-gray-700 pb-4"
                >
                  <button
                    onClick={() => toggleFilter(filter.label)}
                    className="flex items-center justify-between w-full text-left text-white"
                  >
                    <span className="font-medium">{filter.label}</span>
                    <Plus className="w-4 h-4 text-blue-400" />
                  </button>
                  {expandedFilters[filter.label] && (
                    <div className="mt-2 space-y-2">
                      {filter.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center text-gray-300"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-600 bg-black mr-2"
                          />
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">All Vehicles</h1>
              <p className="text-gray-400">
                Choose from our best-selling lineup
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((v) => (
                <Card
                  key={v._id}
                  className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden group"
                >
                  <CardHeader className="p-0">
                    <div className="aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={v.images?.[0]}
                        alt={`${v.title} image`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex flex-col">
                    <CardTitle className="text-xl font-semibold text-white mb-3">
                      {v.title}
                    </CardTitle>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {v.description}
                    </p>

                    {/* Price & Category */}
                    <div className="flex justify-between text-sm text-gray-300 mb-4 border-t border-gray-700 pt-4">
                      <div>
                        <p className="font-semibold">{v.price}</p>
                        <p className="text-xs">Price</p>
                      </div>
                      <div>
                        <p className="font-semibold">{v.category}</p>
                        <p className="text-xs">Category</p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <Link
                        to={`/products/${v._id}`} // or v.slug if you store slugs
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-center"
                      >
                        Know More
                      </Link>
                      <a
                        href={v.brochureFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-full border border-blue-500 hover:bg-blue-600 hover:text-white text-blue-500"
                      >
                        PDF
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for product details */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="bg-gray-900 text-white max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.title}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedProduct.category} · {selectedProduct.price}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <img
                  src={selectedProduct.images?.[0]}
                  alt={selectedProduct.title}
                  className="w-full h-64 object-contain mb-4"
                />
                <p className="text-sm text-gray-300">
                  {selectedProduct.description}
                </p>
              </div>
              <div className="mt-4">
                <a
                  href={selectedProduct.brochureFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Download Brochure
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
