import findTruck from "@/assets/find-truck.jpg";
import { useState } from "react";
import { productFind } from "@/services/productService";
import { useNavigate } from "react-router-dom";

export default function TruckFinder() {
  const [application, setApplication] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [tonnage, setTonnage] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const navigate = useNavigate();

  const handleFindNow = async () => {
    try {
      // Create filter parameters object
      const filterParams = {
        application: application !== "All" ? application : undefined,
        fuelType: fuelType !== "All" ? fuelType : undefined,
        tonnage: tonnage !== "All" ? tonnage : undefined,
        priceRange: priceRange !== "All" ? priceRange : undefined,
      };

      // Remove undefined values
      const cleanedParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, value]) => value !== undefined)
      );

      // Create URL search params
      const searchParams = new URLSearchParams(cleanedParams);

      // Navigate to products page with filter parameters
      navigate(`/products?${searchParams.toString()}`);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${findTruck})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl w-full -mt-20">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-10">
          Find the Perfect Truck for your needs
        </h1>

        {/* Dropdowns in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Application Dropdown */}
          <div className="relative">
            <select
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="appearance-none w-full bg-transparent border border-white px-4 py-3 rounded text-white focus:outline-none pr-10"
            >
              <option value="All" className="bg-white text-black border-b">
                Choose Application
              </option>
              <option value="12" className="bg-white text-black border-b">
                Agricultural
              </option>
              <option value="13" className="bg-white text-black border-b">
                Fruits and Vegetables
              </option>
              <option value="14" className="bg-white text-black border-b">
                Agri Products
              </option>
              <option value="15" className="bg-white text-black border-b">
                Cereal
              </option>
              <option value="16" className="bg-white text-black border-b">
                Market Load
              </option>
              <option value="21" className="bg-white text-black border-b">
                Logistics
              </option>
              <option value="63" className="bg-white text-black border-b">
                Refrigerated Vans
              </option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
              ▼
            </span>
          </div>

          {/* Fuel Type Dropdown */}
          <div className="relative">
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="appearance-none w-full bg-transparent border border-white px-4 py-3 rounded text-white focus:outline-none pr-10"
            >
              <option value="All" className="bg-white text-black border-b">
                Choose Fuel Type
              </option>
              <option value="cng" className="bg-white text-black border-b">
                CNG
              </option>
              <option value="diesel" className="bg-white text-black border-b">
                Diesel
              </option>
              <option value="petrol" className="bg-white text-black border-b">
                Petrol
              </option>
              <option
                value="cng_petrol"
                className="bg-white text-black border-b"
              >
                CNG+Petrol
              </option>
              <option value="electric" className="bg-white text-black border-b">
                Electric
              </option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
              ▼
            </span>
          </div>

          {/* Tonnage Dropdown */}
          <div className="relative">
            <select
              value={tonnage}
              onChange={(e) => setTonnage(e.target.value)}
              className="appearance-none w-full bg-transparent border border-white px-4 py-3 rounded text-white focus:outline-none pr-10"
            >
              <option value="All" className="bg-white text-black border-b">
                Choose Tonnage
              </option>
              <option value="61" className="bg-white text-black border-b">
                11500 Kgs
              </option>
              <option value="62" className="bg-white text-black border-b">
                11600 Kgs
              </option>
              <option value="69" className="bg-white text-black border-b">
                11800 Kgs
              </option>
              <option value="70" className="bg-white text-black border-b">
                20000 Kgs
              </option>
              <option value="71" className="bg-white text-black border-b">
                21000 Kgs
              </option>
              <option value="72" className="bg-white text-black border-b">
                22000 Kgs
              </option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
              ▼
            </span>
          </div>

          {/* Price Range Dropdown */}
          <div className="relative">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="appearance-none w-full bg-transparent border border-white px-4 py-3 rounded text-white focus:outline-none pr-10"
            >
              <option value="All" className="bg-white text-black border-b">
                Vehicle Price Range
              </option>
              <option value="0-10L" className="bg-white text-black border-b">
                0 - 10 Lakhs
              </option>
              <option value="10-20L" className="bg-white text-black border-b">
                10 - 20 Lakhs
              </option>
              <option value="20-30L" className="bg-white text-black border-b">
                20 - 30 Lakhs
              </option>
              <option value="30L+" className="bg-white text-black border-b">
                30 Lakhs +
              </option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
              ▼
            </span>
          </div>
        </div>

        {/* Find Now Button */}
        <button
          onClick={handleFindNow}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-medium shadow-lg"
        >
          Find Now →
        </button>
      </div>
    </div>
  );
}
