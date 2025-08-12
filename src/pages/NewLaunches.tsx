import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, Star, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";
import acepro1 from "../assets/acepro-1.jpg";
import acepro2 from "../assets/acepro-2.jpg";
import acepro3 from "../assets/acepro-3.jpg";
import acepro4 from "../assets/acepro-4.jpg";

// New launch products from the CSV data
const newLaunchProducts = [
  {
    id: "intra-v70",
    name: "Tata Intra V70",
    category: "SCV Cargo",
    subcategory: "Tata Intra Series",
    description:
      "The revolutionary Tata Intra V70 with advanced technology, superior payload capacity, and enhanced fuel efficiency for modern business needs.",
    image: acepro1, // ✅ Replaced with local asset
    launchDate: "2024",
    isNew: true,
    keyFeatures: [
      "Enhanced Payload Capacity",
      "Advanced BS6 Engine",
      "Smart Connectivity",
    ],
    tonnage: "1070 kg",
    engine: "1.2L BS6",
    fuelType: "Diesel",
    startingPrice: "₹6.85 Lakh*",
  },
];

// Featured upcoming launches
const upcomingLaunches = [
  {
    id: "ace-ev-plus",
    name: "Tata Ace EV Plus",
    category: "SCV Cargo",
    subcategory: "Tata Ace Series",
    description:
      "Next-generation electric commercial vehicle with extended range and faster charging capabilities.",
    image: acepro2, // ✅ Replaced with local asset
    launchDate: "Q2 2025",
    isUpcoming: true,
    range: "150 km",
    battery: "21.3 kWh",
    chargingTime: "4.5 hrs",
    expectedPrice: "₹7.50 Lakh*",
  },
  {
    id: "yodha-ev",
    name: "Tata Yodha EV",
    category: "Yodha Pickup",
    description:
      "Revolutionary electric pickup truck designed for sustainable cargo transportation.",
    image: acepro3, // ✅ Replaced with local asset
    launchDate: "Q4 2025",
    isUpcoming: true,
    payload: "1500 kg",
    range: "200 km",
    battery: "35 kWh",
    expectedPrice: "₹12.50 Lakh*",
  },
];
const filterOptions = [
  {
    label: "Launch Status",
    options: ["New Launch", "Coming Soon", "Pre-Launch"],
  },
  { label: "Vehicle Type", options: ["SCV", "LCV", "ICV", "MCV", "Pickup"] },
  { label: "Fuel Type", options: ["Diesel", "Electric", "CNG"] },
  { label: "Launch Year", options: ["2024", "2025", "2026"] },
];

export default function NewLaunches() {
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
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">
              Home
            </a>
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">New Launches</span>
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
                placeholder="Search launches"
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
                New Launches
              </h1>
              <p className="text-gray-600">
                Stay tuned for our latest Tata Motors commercial vehicle
                launches, packed with innovation, reliability, and performance.
              </p>
            </div>

            {/* Latest Launches Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Latest Launches
                </h2>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Available Now
                </Badge>
              </div>

              <div className="grid gap-6">
                {newLaunchProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden group"
                  >
                    {/* Compare Button */}
                    <div className="relative">
                      <button className="absolute top-3 right-3 bg-white/90 hover:bg-white px-3 py-1 rounded text-sm text-gray-700 z-10 shadow-sm">
                        Compare
                      </button>
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-green-600 text-white">
                          <Zap className="w-3 h-3 mr-1" />
                          New Launch
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="p-0">
                      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </CardTitle>

                      <p className="text-sm text-gray-600 mb-4">
                        {product.description}
                      </p>

                      {/* Specifications */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {product.tonnage}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Payload Capacity
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {product.engine}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Engine
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {product.fuelType}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Fuel Type
                          </div>
                        </div>
                      </div>

                      <div className="text-sm mb-4 text-gray-900">
                        Starting at{" "}
                        <span className="font-semibold text-lg">
                          {product.startingPrice}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md">
                          Book Test Drive
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-md"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Coming Soon Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Coming Soon
                </h2>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  Upcoming
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingLaunches.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden group"
                  >
                    {/* Compare Button */}
                    <div className="relative">
                      <button className="absolute top-3 right-3 bg-white/90 hover:bg-white px-3 py-1 rounded text-sm text-gray-700 z-10 shadow-sm">
                        Compare
                      </button>
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-orange-600 text-white">
                          <Calendar className="w-3 h-3 mr-1" />
                          {product.launchDate}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="p-0">
                      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </CardTitle>

                      <p className="text-sm text-gray-600 mb-4">
                        {product.description}
                      </p>

                      {/* Specifications */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {product.payload || product.range}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.payload ? "Payload" : "Range"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {product.battery}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Battery
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {product.chargingTime || product.range}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.chargingTime ? "Charging" : "Range"}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm mb-4 text-gray-900">
                        Expected at{" "}
                        <span className="font-semibold text-lg">
                          {product.expectedPrice}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-md">
                          Notify Me
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-md"
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
