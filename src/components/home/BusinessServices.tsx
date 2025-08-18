import React from "react";
import { Link } from "react-router-dom";

const services = [
  { number: "16K", label: "Service points" },
  { number: "90%", label: "District covered" },
  { number: "6.4 kms", label: "Average distance to the nearest workshop" },
  { number: "38", label: "Area service office" },
  { number: "150+", label: "Service engineers" },
];

const logos = [
  {
    title: "Fleet Edge",
    desc: "Get live updates on vehicle movement remotely on Fleet Edge",
  },
  {
    title: "Sampoorna Seva",
    desc: "Remove or minimise the risks associated with vehicle maintenance.",
  },
  {
    title: "Suraksha",
    desc: "One-stop solution for all your spares needs.",
  },
  {
    title: "Tata Genuine Parts",
    desc: "Maintenance and repair services at specified National Highways through Service outlets.",
  },
];

// Create accurate service logos based on your reference image
const ServiceLogo = ({ type }) => {
  switch (type) {
    case "fleet-edge":
      return (
        <div className="h-20 w-full max-w-[200px] bg-gray-900 rounded flex items-center justify-center text-white relative overflow-hidden">
          <div className="text-center">
            <div className="text-xs text-blue-400 mb-1">TATA MOTORS</div>
            <div className="text-lg font-bold tracking-wider">Fleet Edge</div>
          </div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full opacity-60"></div>
        </div>
      );
    case "sampoorna":
      return (
        <div className="h-20 w-full max-w-[200px] bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-white relative overflow-hidden">
          <div className="text-center z-10">
            <div className="text-sm font-bold">SAMPOORNA</div>
            <div className="text-sm font-bold">SEVA</div>
          </div>
          <div className="absolute inset-0 bg-blue-600 opacity-80"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-2 left-2 right-2 h-px bg-white opacity-30"></div>
            <div className="absolute bottom-2 left-2 right-2 h-px bg-white opacity-30"></div>
          </div>
        </div>
      );
    case "suraksha":
      return (
        <div className="h-20 w-full max-w-[200px] bg-blue-900 rounded flex items-center justify-center text-white relative overflow-hidden">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-300">
            TATA MOTORS
          </div>
          <div className="text-center mt-1">
            <div className="text-xl font-bold">SURAKSHA</div>
            <div className="text-xs opacity-90">PROTECTION PLAN</div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-yellow-500 rounded-t"></div>
          <div className="absolute top-0 right-2 w-8 h-8 border-2 border-white opacity-20 rounded-full"></div>
        </div>
      );
    case "genuine-parts":
      return (
        <div className="h-20 w-full max-w-[200px] bg-white border-2 border-blue-200 rounded flex items-center justify-center relative">
          <div className="text-center">
            <div className="text-blue-600 font-bold text-xl">TATA</div>
            <div className="text-blue-600 text-sm">Genuine</div>
            <div className="text-blue-600 text-sm">Parts</div>
          </div>
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-blue-300"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-yellow-400"></div>
        </div>
      );
    default:
      return null;
  }
};

const logoTypes = ["fleet-edge", "sampoorna", "suraksha", "genuine-parts"];

export default function BusinessServices() {
  return (
    <section className="bg-black text-white py-16 px-6 md:px-16 text-center">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Services that will help your business
      </h2>
      <p className="text-gray-300 max-w-4xl mx-auto text-lg leading-relaxed">
        Tata Motors offers a range of services keeping in mind the comfort and
        convenience of its customers. An end-to-end service which covers
        everything you need for a sustained life of your vehicle and business.
      </p>

      {/* Stats Row with Dividers */}
      <div className="flex justify-center items-center mt-16 mb-16">
        <div className="flex items-center space-x-0">
          {services.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center px-8 md:px-12">
                <p className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {item.number}
                </p>
                <p className="text-gray-300 text-sm md:text-base text-center leading-tight">
                  {item.label}
                </p>
              </div>
              {index < services.length - 1 && (
                <div className="h-16 w-px bg-gray-600 mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {logos.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* White box with logo */}
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center justify-center w-full h-32 hover:shadow-xl transition-shadow duration-300">
              <ServiceLogo type={logoTypes[index]} />
            </div>
            {/* Description below the white box */}
            <p className="text-sm text-center text-gray-300 mt-4 leading-relaxed max-w-xs">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="mt-12 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-300 text-lg">
        <Link to={"/Services"}>Know More →</Link>
      </button>
    </section>
  );
}
