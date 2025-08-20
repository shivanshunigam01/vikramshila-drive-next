import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function BookService() {
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    const serviceFromUrl = searchParams.get("service");
    if (serviceFromUrl) {
      setSelectedService(serviceFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Service booking submitted successfully for: ${selectedService}`);
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-5xl px-6">
          <form
            onSubmit={handleSubmit}
            className="w-full p-10 border-4 border-blue-500 rounded-lg shadow-lg bg-black text-white"
          >
            <h2 className="text-4xl font-bold text-center mb-3">
              Book Your Service
            </h2>
            <p className="text-center text-gray-300 mb-10 text-lg">
              Please fill out the form to book a service appointment with Tata
              Motors.
            </p>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                value={selectedService}
                readOnly
                className="p-4 rounded-md bg-gray-900 border border-gray-500 text-gray-300"
              />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="p-4 rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                required
                className="p-4 rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <select
                required
                className="p-4 rounded-md bg-black border border-gray-500 focus:ring-2 focus:ring-blue-500"
              >
                <option>Select State</option>
                <option>Maharashtra</option>
                <option>Gujarat</option>
                <option>Karnataka</option>
              </select>
              <input
                type="text"
                placeholder="Enter Pincode"
                required
                className="p-4 rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <select
                required
                className="p-4 rounded-md bg-black border border-gray-500 focus:ring-2 focus:ring-blue-500"
              >
                <option>Select Vehicle</option>
                <option>Ace Pro</option>
                <option>Pickup</option>
                <option>LCV</option>
              </select>
              <input
                type="date"
                required
                className="p-4 rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="mt-8 space-y-3 text-sm">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  required
                  className="mt-1 text-blue-500"
                />
                <span>
                  I agree that by clicking on 'Submit', I am explicitly
                  soliciting a call from Tata Motors or its associates.
                </span>
              </label>
              <label className="flex items-start space-x-2">
                <input type="checkbox" className="mt-1 text-blue-500" />
                <span>
                  Allow Tata Motors to send you information about Tata Products
                  on WhatsApp.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold text-lg"
              >
                Submit →
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
