import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import serviceBanner from "@/assets/service-page-banner.webp";
import fleetEdge from "@/assets/image.webp";
import amc from "@/assets/image(1).webp";
import sampoorna from "@/assets/image(2).webp";
import tataOk from "@/assets/image(3).png";
import guru from "@/assets/image(4).webp";
import fleetCareBanner from "../assets/fleet-care_new_banner.jpg";

export default function ServicesPage() {
  return (
    <div className="bg-black text-white font-sans">
      {/* Header/Navbar */}
      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 py-4 text-sm">
        <ol className="flex items-center space-x-2 text-gray-300">
          <li>
            <Link to="/" className="hover:underline hover:text-white">
              Home
            </Link>
          </li>
          <li>{">"}</li>
          <li className="text-white">Services</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div
        className="relative h-[40vh] md:h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${serviceBanner})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Unparalleled After Sales Services by Tata Motors
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            At Tata Motors, we go beyond just delivering vehicles. Our robust
            after-sales services ensure that your business runs seamlessly,
            supported by the expertise and reliability of our dedicated service
            teams.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Add-On Services for Your Product Purchase
        </h2>

        {/* Fleet Edge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={fleetEdge}
            alt="Fleet Edge"
            className="rounded-lg"
            width={640}
            height={446}
            loading="lazy"
          />
          <div>
            <h3 className="text-xl font-semibold mb-4">Fleet Edge</h3>
            <p className="text-gray-300 mb-4">
              Gain live updates on vehicle movement & monitoring with Fleet
              Edge. A telematics-based digital solution that provides you
              real-time insights into your fleet, helping optimize productivity
              and reduce costs.
            </p>
            <ul className="flex gap-8 text-blue-400 mb-6">
              <li>1.59L+ Trucks</li>
              <li>3.74L+ Truck Vehicles</li>
              <li>456M+ KM Tracked</li>
            </ul>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow">
                Know More →
              </button>
              <Link
                to={`/book-service?service=${encodeURIComponent("Fleet Edge")}`}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow"
              >
                Book Service →
              </Link>
            </div>
          </div>
        </div>

        {/* AMC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              About Suraksha Annual Maintenance Contract (AMC)
            </h3>
            <p className="text-gray-300 mb-6">
              Tata Motors Suraksha Annual Maintenance Contract is a service plan
              that ensures your trucks remain in top condition. Covering both
              preventive and corrective maintenance, it allows you to focus on
              your business while we take care of your fleet.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow">
                Know More →
              </button>
              <Link
                to={`/book-service?service=${encodeURIComponent(
                  "Suraksha Annual Maintenance Contract (AMC)"
                )}`}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow"
              >
                Book Service →
              </Link>
            </div>
          </div>
          <img
            src={amc}
            alt="AMC"
            className="rounded-lg"
            width={640}
            height={440}
            loading="lazy"
          />
        </div>

        {/* Sampoorna Seva */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <img
            src={sampoorna}
            alt="Sampoorna Seva"
            className="rounded-lg"
            width={640}
            height={440}
            loading="lazy"
          />
          <div>
            <h3 className="text-xl font-semibold mb-4">Sampoorna Seva 2.0</h3>
            <p className="text-gray-300 mb-6">
              Tata Motors’ Sampoorna Seva 2.0 is an all-inclusive package
              designed to provide peace of mind. It covers breakdown support,
              extended warranty, and more.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow">
                Know More →
              </button>
              <Link
                to={`/book-service?service=${encodeURIComponent(
                  "Sampoorna Seva 2.0"
                )}`}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow"
              >
                Book Service →
              </Link>
            </div>
          </div>
        </div>

        {/* Tata OK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-4">TATA OK</h3>
            <p className="text-gray-300 mb-6">
              100% risk-free pre-owned commercial vehicles by Tata Motors.
              Ensuring customers get the best deal with quality checks and
              reliable certification.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow">
                Know More →
              </button>
              <Link
                to={`/book-service?service=${encodeURIComponent("TATA OK")}`}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow"
              >
                Book Service →
              </Link>
            </div>
          </div>
          <img src={tataOk} alt="Tata OK" className="rounded-lg" />
        </div>

        {/* Tata Guru */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <img
            src={guru}
            alt="Tata Guru"
            className="rounded-lg"
            width={640}
            height={440}
            loading="lazy"
          />
          <div>
            <h3 className="text-xl font-semibold mb-4">TATA Guru</h3>
            <p className="text-gray-300 mb-6">
              TATA Guru is a unique initiative to train mechanics and service
              providers with the latest know-how to deliver better service for
              Tata Motors’ customers.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow">
                Know More →
              </button>
              <Link
                to={`/book-service?service=${encodeURIComponent("TATA Guru")}`}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow"
              >
                Book Service →
              </Link>
            </div>
          </div>
        </div>

        {/* Fleet Care */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-4">Tata Fleetcare</h3>
            <p className="text-gray-300 mb-6">
              A holistic solution ensuring uptime, predictable costs, and expert
              care for your entire fleet. Tata FleetCare combines maintenance,
              repair, and fleet management for maximum productivity.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg shadow">
                Know More →
              </button>
              <Link
                to={`/book-service?service=${encodeURIComponent(
                  "Tata Fleetcare"
                )}`}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg shadow"
              >
                Book Service →
              </Link>
            </div>
          </div>
          <img src={fleetCareBanner} alt="Fleet Care" className="rounded-lg" />
        </div>
      </div>

      {/* Assistance Banner */}
      <div className="bg-blue-600 py-10 text-center">
        <h3 className="text-xl font-semibold mb-3">
          For any assistance, call now
        </h3>
        <p className="text-2xl font-bold">18002097979</p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
