import findTruck from "@/assets/find-truck.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { applicationFind, productFind } from "@/services/productService";

export default function TruckFinder() {
  const [application, setApplication] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [payload, setPayload] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [applications, setApplications] = useState<string[]>([]);
  const navigate = useNavigate();

  // ✅ Fetch Applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationFind({});
        if (res.data.success && Array.isArray(res.data.data)) {
          // Directly set applications since API returns an array of strings
          setApplications(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);
  // ✅ Handle Find Now
  const handleFindNow = async () => {
    const filterParams: Record<string, string> = {
      ...(application !== "all" && { application }),
      ...(fuelType !== "all" && { fuelType }),
      ...(payload !== "all" && { payload }),
      ...(priceRange !== "all" && { priceRange }),
    };

    // Option A: navigate and let Products page fetch with GET /products/filter
    const searchParams = new URLSearchParams(filterParams);
    navigate(`/products?${searchParams.toString()}`);

    // Option B: or fetch right here (if you render results on the same page)
    // const { data } = await axios.get(`/api/products/filter`, { params: filterParams });
    // setResults(data.data);
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${findTruck})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl w-full -mt-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-10">
          Find the Perfect Product for your needs
        </h1>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Application Dropdown (from API) */}
          <div className="relative">
            <select
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="appearance-none w-full bg-transparent border border-white px-4 py-3 rounded text-white focus:outline-none pr-10"
            >
              <option value="all" disabled className="bg-white text-black">
                Choose Application
              </option>
              {applications.map((app, idx) => (
                <option key={idx} value={app} className="bg-white text-black">
                  {app}
                </option>
              ))}
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
              <option value="all" className="bg-white text-black">
                Choose Fuel Type
              </option>
              <option value="cng" className="bg-white text-black">
                CNG
              </option>
              <option value="diesel" className="bg-white text-black">
                Diesel
              </option>
              <option value="petrol" className="bg-white text-black">
                Petrol
              </option>
              <option value="cng_petrol" className="bg-white text-black">
                CNG+Petrol
              </option>
              <option value="electric" className="bg-white text-black">
                Electric
              </option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
              ▼
            </span>
          </div>

          {/* Payload Dropdown (same options as Products page) */}
          <div className="relative">
            <select
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="appearance-none w-full bg-transparent border border-white px-4 py-3 rounded text-white focus:outline-none pr-10"
            >
              <option value="all" className="bg-white text-black">
                Choose Payload
              </option>
              <option value="500-750" className="bg-white text-black">
                500 - 750 Kg
              </option>
              <option value="750-1500" className="bg-white text-black">
                750 - 1500 Kg
              </option>
              <option value="1500-3000" className="bg-white text-black">
                1500 - 3000 Kg
              </option>
              <option value="3000-6000" className="bg-white text-black">
                3000 - 6000 Kg
              </option>
              <option value="6000+" className="bg-white text-black">
                6000 Kg +
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
              <option value="all" className="bg-white text-black">
                Choose Price Range
              </option>
              <option value="500000-1500000" className="bg-white text-black">
                ₹5 Lakh - ₹15 Lakh
              </option>
              <option value="1500000-2000000" className="bg-white text-black">
                ₹15 Lakh - ₹20 Lakh
              </option>
              <option value="2000000-2500000" className="bg-white text-black">
                ₹20 Lakh - ₹25 Lakh
              </option>
              <option value="2500000-3000000" className="bg-white text-black">
                ₹25 Lakh - ₹30 Lakh
              </option>
              <option value="3000000+" className="bg-white text-black">
                ₹30 Lakh+
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
