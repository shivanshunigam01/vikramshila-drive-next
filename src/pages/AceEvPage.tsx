import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import aceEvBanner from "@/assets/ace-pro-ev-inner-banner.jpg";
import ace1 from "@/assets/ace-1.png";
import ace2 from "@/assets/ace-2.png";
import ace3 from "@/assets/ace-3.png";
import ace4 from "@/assets/ace-4.png";
import ace5 from "@/assets/ace-1.png";
import ace6 from "@/assets/ace-2.png";

export default function AceEvPage() {
  return (
    <div className="bg-black text-white font-sans">
      {/* Header/Navbar */}
      <Header />

      {/* Hero Section */}
      <section>
        <div
          className="relative h-[500px] bg-cover bg-center"
          style={{ backgroundImage: `url(${aceEvBanner})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </section>

      {/* Intro Text Section */}
      <section className="bg-black text-center py-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Tata ACE EV – Kaamyaabi Ko Kare Charge
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          India’s most affordable and trusted mini electric truck designed for
          sustainable performance, low ownership cost, and maximum business
          gains.
        </p>
        <p className="text-2xl font-bold text-blue-400">
          Starting from ₹6.5 Lakh
        </p>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-12">
          Why Choose Tata ACE EV?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Low total cost of ownership
            </h3>
            <p className="text-gray-300">
              Economical ownership with reduced running cost.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Heavy duty payload</h3>
            <p className="text-gray-300">
              Carry large loads with ease for maximum efficiency.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">1 Cr+ Owners</h3>
            <p className="text-gray-300">
              Trusted by millions for over 19 years in India.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Tata Ace EV Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FeatureCard
            img={ace1}
            title="Futuristic Performance"
            desc="Eco-friendly, silent, and efficient EV drive."
          />
          <FeatureCard
            img={ace2}
            title="Smart Connectivity"
            desc="Stay connected with fleet telematics & IoT support."
          />
          <FeatureCard
            img={ace3}
            title="Charged for Future"
            desc="Fast charging with robust battery pack."
          />
          <FeatureCard
            img={ace4}
            title="High Range"
            desc="Go the distance with extended mileage."
          />
          <FeatureCard
            img={ace5}
            title="Strong Build"
            desc="Rugged, durable, and built for Indian roads."
          />
          <FeatureCard
            img={ace6}
            title="Reliable Support"
            desc="Backed by Tata’s service excellence."
          />
        </div>
      </section>

      {/* Key Specs */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-semibold mb-10">Key Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <SpecCard label="Range" value="154 KM / charge" />
            <SpecCard label="Battery" value="21.3 kWh Li-ion" />
            <SpecCard label="Top Speed" value="60 KM/h" />
            <SpecCard label="Payload" value="600 KG" />
          </div>
        </div>
      </section>

      {/* Assistance Banner */}
      <section className="bg-blue-700 py-10 text-center">
        <h3 className="text-xl font-semibold mb-3">
          Want to know more about Tata Ace EV?
        </h3>
        <p className="text-2xl font-bold">Call 18002097979</p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function FeatureCard({ img, title, desc }) {
  return (
    <div>
      <img src={img} alt={title} className="rounded-lg mb-4 w-full" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{desc}</p>
    </div>
  );
}

function SpecCard({ label, value }) {
  return (
    <div className="bg-white/10 p-6 rounded-lg shadow-md">
      <p className="text-lg font-bold">{label}</p>
      <p>{value}</p>
    </div>
  );
}
