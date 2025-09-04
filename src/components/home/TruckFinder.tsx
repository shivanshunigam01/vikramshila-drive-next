import findTruck from "@/assets/find-truck.jpg";
import { useState } from "react";
import { productFind } from "@/services/productService";
import { useNavigate } from "react-router-dom";

export default function TruckFinder() {
  const [application, setApplication] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [payload, setPayload] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const navigate = useNavigate();

  const handleFindNow = async () => {
    try {
      // Create filter parameters object
      const filterParams = {
        application: application !== "All" ? application : undefined,
        fuelType: fuelType !== "All" ? fuelType : undefined,
        payload: payload !== "All" ? payload : undefined,
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
                Agri products
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
              <option value="22" className="bg-white text-black border-b">
                Pharma
              </option>
              <option value="23" className="bg-white text-black border-b">
                Poultry
              </option>
              <option value="24" className="bg-white text-black border-b">
                Service support van
              </option>
              <option value="25" className="bg-white text-black border-b">
                Parcel & Courier
              </option>
              <option value="26" className="bg-white text-black border-b">
                LPG Cylinders
              </option>
              <option value="27" className="bg-white text-black border-b">
                Lifestyle
              </option>
              <option value="28" className="bg-white text-black border-b">
                Gas Cylinders
              </option>
              <option value="29" className="bg-white text-black border-b">
                Cash Vans
              </option>
              <option value="30" className="bg-white text-black border-b">
                Cement
              </option>
              <option value="31" className="bg-white text-black border-b">
                E-Commerce
              </option>
              <option value="32" className="bg-white text-black border-b">
                Utility Vehicles
              </option>
              <option value="33" className="bg-white text-black border-b">
                Event Management
              </option>
              <option value="34" className="bg-white text-black border-b">
                Food allied services
              </option>
              <option value="35" className="bg-white text-black border-b">
                Hotels
              </option>
              <option value="36" className="bg-white text-black border-b">
                Perishable goods
              </option>
              <option value="37" className="bg-white text-black border-b">
                Tent house
              </option>
              <option value="38" className="bg-white text-black border-b">
                Municipal application
              </option>
              <option value="39" className="bg-white text-black border-b">
                Furniture
              </option>
              <option value="40" className="bg-white text-black border-b">
                White Goods
              </option>
              <option value="41" className="bg-white text-black border-b">
                Fisheries
              </option>
              <option value="42" className="bg-white text-black border-b">
                FMCG
              </option>
              <option value="43" className="bg-white text-black border-b">
                Bakery
              </option>
              <option value="44" className="bg-white text-black border-b">
                Catering
              </option>
              <option value="45" className="bg-white text-black border-b">
                Foodtruck
              </option>
              <option value="46" className="bg-white text-black border-b">
                Cold drinks
              </option>
              <option value="47" className="bg-white text-black border-b">
                Milk
              </option>
              <option value="48" className="bg-white text-black border-b">
                Milk Grains
              </option>
              <option value="111" className="bg-white text-black border-b">
                Pure water
              </option>
              <option value="112" className="bg-white text-black border-b">
                Milk & Diary
              </option>
              <option value="49" className="bg-white text-black border-b">
                Mineral Water
              </option>
              <option value="50" className="bg-white text-black border-b">
                Tea leaves
              </option>
              <option value="51" className="bg-white text-black border-b">
                Water bottles
              </option>
              <option value="113" className="bg-white text-black border-b">
                Food Grains
              </option>
              <option value="17" className="bg-white text-black border-b">
                Construction
              </option>
              <option value="18" className="bg-white text-black border-b">
                Building & Construction
              </option>
              <option value="19" className="bg-white text-black border-b">
                Industrial Goods
              </option>
              <option value="20" className="bg-white text-black border-b">
                Heavy Industries
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

          {/* Payload Dropdown */}
          <div className="relative">
            <select
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="appearance-none w-full bg-transparent border border-white px-4 py-3 rounded text-white focus:outline-none pr-10"
            >
              <option value="All" className="bg-white text-black border-b">
                Choose Payload
              </option>
              <option value="500-750" className="bg-white text-black border-b">
                500 - 750 Kgs
              </option>
              <option value="750-1500" className="bg-white text-black border-b">
                750 - 1500 Kgs
              </option>
              <option
                value="1500-3000"
                className="bg-white text-black border-b"
              >
                1500 - 3000 Kgs
              </option>
              <option
                value="3000-6000"
                className="bg-white text-black border-b"
              >
                3000 - 6000 Kgs
              </option>
              <option
                value="6000-9000"
                className="bg-white text-black border-b"
              >
                6000 - 9000 Kgs
              </option>
              <option
                value="9000-12000"
                className="bg-white text-black border-b"
              >
                9000 - 12000 Kgs
              </option>
              <option value="12000+" className="bg-white text-black border-b">
                12000 Kgs +
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
              <option value="5-15L" className="bg-white text-black border-b">
                5 - 15 Lakhs
              </option>
              <option value="15-20L" className="bg-white text-black border-b">
                15 - 20 Lakhs
              </option>
              <option value="20-25L" className="bg-white text-black border-b">
                20 - 25 Lakhs
              </option>
              <option value="30L+" className="bg-white text-black border-b">
                30 Lakhs or More
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
