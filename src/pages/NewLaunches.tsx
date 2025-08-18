import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, Zap } from "lucide-react";

import acepro1 from "../assets/acepro-1.jpg";
import acepro2 from "../assets/acepro-2.jpg";
import acepro3 from "../assets/acepro-3.jpg";
import launchBanner from "../assets/fleet-care_new_banner.jpg";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// New launch products
const newLaunchProducts = [
  {
    id: "intra-v70",
    name: "Tata Intra V70",
    category: "SCV Cargo",
    subcategory: "Tata Intra Series",
    description:
      "The revolutionary Tata Intra V70 with advanced technology, superior payload capacity, and enhanced fuel efficiency for modern business needs.",
    image: acepro1,
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

// Upcoming launches
const upcomingLaunches = [
  {
    id: "ace-ev-plus",
    name: "Tata Ace EV Plus",
    category: "SCV Cargo",
    subcategory: "Tata Ace Series",
    description:
      "Next-generation electric commercial vehicle with extended range and faster charging capabilities.",
    image: acepro2,
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
    image: acepro3,
    launchDate: "Q4 2025",
    isUpcoming: true,
    payload: "1500 kg",
    range: "200 km",
    battery: "35 kWh",
    expectedPrice: "₹12.50 Lakh*",
  },
];

export default function NewLaunchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFilters, setExpandedFilters] = useState({});

  const toggleFilter = (filterLabel) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterLabel]: !prev[filterLabel],
    }));
  };

  return (
    <div className="bg-black text-white font-sans">
      {/* Header/Navbar */}
      <Header />

      <nav className="max-w-7xl mx-auto px-6 py-4 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-400">›</li>
          <li className="text-white font-medium">New Launches</li>
        </ol>
      </nav>
      {/* Hero Section */}
      <div
        className="relative h-[450px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${launchBanner})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-3xl text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Tata Motors’ New & Upcoming Launches
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            From advanced SCVs to powerful EV pickups, explore the future-ready
            vehicles designed to drive your business ahead.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex gap-10">
        {/* Sidebar Filters */}
        <aside className="w-72 bg-gray-900 rounded-lg shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-6">Filters</h3>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search launches"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            {["Launch Status", "Vehicle Type", "Fuel Type", "Launch Year"].map(
              (label) => (
                <div key={label} className="border-b border-gray-700 pb-4">
                  <button
                    onClick={() => toggleFilter(label)}
                    className="flex items-center justify-between w-full text-left text-gray-300 hover:text-white"
                  >
                    {label}
                    <Plus className="w-4 h-4" />
                  </button>
                  {expandedFilters[label] && (
                    <div className="mt-2 space-y-2 text-sm text-gray-400">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded bg-gray-800 border-gray-600"
                        />
                        Option 1
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded bg-gray-800 border-gray-600"
                        />
                        Option 2
                      </label>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </aside>

        {/* Launches Content */}
        <main className="flex-1">
          {/* Latest Launches */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-semibold">Latest Launches</h2>
              <Badge className="bg-green-700 text-white">Available Now</Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newLaunchProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group"
                >
                  <CardHeader className="p-0 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600 text-white flex items-center">
                      <Zap className="w-3 h-3 mr-1" /> New Launch
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-6">
                    <CardTitle className="text-lg font-semibold mb-2">
                      {product.name}
                    </CardTitle>
                    <p className="text-gray-400 text-sm mb-4">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="font-semibold">{product.tonnage}</div>
                        <div className="text-xs text-gray-400">Payload</div>
                      </div>
                      <div>
                        <div className="font-semibold">{product.engine}</div>
                        <div className="text-xs text-gray-400">Engine</div>
                      </div>
                      <div>
                        <div className="font-semibold">{product.fuelType}</div>
                        <div className="text-xs text-gray-400">Fuel</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      Starting at{" "}
                      <span className="font-semibold text-lg text-blue-400">
                        {product.startingPrice}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Book Test Drive
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Coming Soon */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-semibold">Coming Soon</h2>
              <Badge className="bg-orange-600 text-white">Upcoming</Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingLaunches.map((product) => (
                <Card
                  key={product.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group"
                >
                  <CardHeader className="p-0 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                    />
                    <Badge className="absolute top-4 left-4 bg-orange-600 text-white flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> {product.launchDate}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-6">
                    <CardTitle className="text-lg font-semibold mb-2">
                      {product.name}
                    </CardTitle>
                    <p className="text-gray-400 text-sm mb-4">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="font-semibold">
                          {product.payload || product.range}
                        </div>
                        <div className="text-xs text-gray-400">
                          {product.payload ? "Payload" : "Range"}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{product.battery}</div>
                        <div className="text-xs text-gray-400">Battery</div>
                      </div>
                      <div>
                        <div className="font-semibold">
                          {product.chargingTime || product.range}
                        </div>
                        <div className="text-xs text-gray-400">
                          {product.chargingTime ? "Charging" : "Range"}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      Expected at{" "}
                      <span className="font-semibold text-lg text-orange-400">
                        {product.expectedPrice}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Notify Me
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
