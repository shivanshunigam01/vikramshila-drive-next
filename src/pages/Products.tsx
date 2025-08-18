import { vehicles } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { openEnquiryDialog } from "@/components/common/EnquiryDialog";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

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

  const toggleFilter = (filterLabel) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterLabel]: !prev[filterLabel],
    }));
  };

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
              {vehicles.map((v) => (
                <Card
                  key={v.slug}
                  className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden group"
                >
                  <CardHeader className="p-0">
                    <div className="aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={v.images[0]}
                        alt={`${v.name} image`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-semibold text-white mb-3">
                      {v.name}
                    </CardTitle>

                    {/* Specs */}
                    <div className="flex justify-between text-sm text-gray-300 mb-4 border-t border-gray-700 pt-4">
                      <div>
                        <p className="font-semibold">{v.gvw}</p>
                        <p className="text-xs">GVW</p>
                      </div>
                      <div>
                        <p className="font-semibold">{v.fuel}</p>
                        <p className="text-xs">Fuel</p>
                      </div>
                      <div>
                        <p className="font-semibold">{v.engine}</p>
                        <p className="text-xs">Engine</p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => openEnquiryDialog(v.name)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md"
                      >
                        Know More
                      </Button>
                      <a
                        href={`/products/${v.slug}`}
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

      <Footer />
    </div>
  );
}
