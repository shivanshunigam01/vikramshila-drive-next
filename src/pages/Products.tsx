import { vehicles } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
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
    <div className="bg-gray-50 min-h-screen">
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
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">
              Home
            </a>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">All Vehicles</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-80 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button className="text-blue-600 text-sm hover:underline">
                Reset All Filters
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Options */}
            <div className="space-y-4">
              {filterOptions.map((filter) => (
                <div
                  key={filter.label}
                  className="border-b border-gray-100 pb-4"
                >
                  <button
                    onClick={() => toggleFilter(filter.label)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-medium text-gray-900">
                      {filter.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-blue-600" />
                      </div>
                    </div>
                  </button>
                  {expandedFilters[filter.label] && (
                    <div className="mt-2 space-y-2">
                      {filter.options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 mr-2"
                          />
                          <span className="text-sm text-gray-600">
                            {option}
                          </span>
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
              <h1 className="text-3xl font-semibold mb-2 text-gray-900">
                All Vehicles
              </h1>
              <p className="text-gray-600">
                Choose from our best-selling lineup
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <Card
                  key={v.slug}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden group"
                >
                  {/* Compare Button */}
                  <div className="relative">
                    <button className="absolute top-3 right-3 bg-white/90 hover:bg-white px-3 py-1 rounded text-sm text-gray-700 z-10 shadow-sm">
                      Compare
                    </button>
                  </div>

                  <CardHeader className="p-0">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={v.images[0]}
                        alt={`${v.name} image`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {v.name}
                    </CardTitle>

                    <p className="text-sm text-gray-600 mb-3">
                      {v.description}
                    </p>

                    <div className="text-sm mb-4 text-gray-900">
                      Starting at{" "}
                      <span className="font-semibold text-lg">
                        ₹ {v.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => openEnquiryDialog(v.name)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md"
                      >
                        Enquire Now
                      </Button>
                      <a href={`/products/${v.slug}`} className="block w-full">
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-md"
                        >
                          View Details
                        </Button>
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
