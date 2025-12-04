import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { TrendingUp, Award, Users, Wrench, Clock, Shield } from "lucide-react";

import hero1 from "@/assets/hero-2.jpg";
import hero2 from "@/assets/hero-3.jpg";
import SmoothImage from "@/components/SmoothImage";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-gradient-to-b from-[#0a0a0e] via-[#0f1115] to-[#101217] text-white">
      {/* SEO META SET */}
      <Helmet>
        <title>
          About Vikramshila Automobiles | Tata Motors Commercial Vehicle Dealer
        </title>

        <meta
          name="description"
          content="Vikramshila Automobiles is an authorized Tata Motors Commercial Vehicle dealership serving Bhagalpur, Banka & Khagaria. We offer the complete SCV, LCV, ICV, MCV, HCV & Bus range with finance, service, and fleet support."
        />

        <meta
          name="keywords"
          content="Tata Motors Dealer Bhagalpur, Tata CV Dealer Bihar, Vikramshila Automobiles, Tata Trucks Bhagalpur, Tata Intra V50 Dealer, Tata ACE Dealer Bhagalpur, Tata Buses Bihar"
        />

        <link rel="canonical" href="https://vikramshilaautomobiles.com/about" />

        <meta property="og:title" content="About Vikramshila Automobiles" />
        <meta
          property="og:description"
          content="Authorized Tata Motors Commercial Vehicle dealer in Bhagalpur, Banka & Khagaria."
        />
        <meta property="og:image" content="/og-about.jpg" />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "Vikramshila Automobiles",
              "url": "https://vikramshilaautomobiles.com",
              "logo": "/logo.png",
              "image": "/og-about.jpg",
              "description": "Authorized Tata Motors Commercial Vehicle Dealer in Bhagalpur, Banka & Khagaria.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bhagalpur",
                "addressRegion": "Bihar",
                "addressCountry": "India"
              }
            }
          `}
        </script>
      </Helmet>

      <Header />

      <main>
        {/* 🔵 HERO SECTION (CLAUDE STYLE BUT MATCHED TO YOUR DARK THEME) */}
        {/* 🔵 HERO SECTION — DARK THEME */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-black via-[#0a0a0e] to-[#0f1115] border-b border-white/10">
          <div className="container mx-auto max-w-5xl relative z-10 text-center md:text-left">
            {/* REMOVED Dealer Badge */}

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
              Empowering Businesses,
              <br />
              <span className="text-blue-400">One Fleet at a Time</span>
            </h1>

            <p className="text-lg text-gray-300 mt-6 max-w-3xl">
              Serving Bhagalpur, Banka & Khagaria with the complete Tata Motors
              Commercial Vehicle range — backed by finance, service, and
              reliable fleet support.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14">
              {[
                { n: "1000+", l: "Fleet Owners" },
                { n: "24/7", l: "Support" },
                { n: "100%", l: "Genuine Parts" },
                { n: "15+", l: "Years Trust" },
              ].map((item) => (
                <div key={item.n} className="text-center">
                  <div className="text-4xl font-bold text-blue-400">
                    {item.n}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{item.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* 🟣 WHO WE ARE — Combined UI */}
          <section className="py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-2xl blur-xl"></div>

              <SmoothImage
                src={hero1}
                alt="Vikramshila Automobiles Showroom"
                className="rounded-2xl shadow-2xl"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6">Who We Are</h2>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Vikramshila Automobiles is one of Eastern Bihar’s leading Tata
                Motors Commercial Vehicle dealerships offering SCV, Pickup, ICV,
                LCV, MCV, HCV and Bus range with seamless sales, finance and
                service assistance.
              </p>

              <p className="text-gray-300 mb-8 leading-relaxed">
                With our trained team, modern facilities and customer-focused
                approach, we are committed to keeping your fleet efficient,
                profitable and road-ready.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
                    title: "Full CV Range",
                    sub: "SCV to Buses",
                  },
                  {
                    icon: <Clock className="w-8 h-8 text-green-400" />,
                    title: "24×7 Support",
                    sub: "Breakdown & RSA",
                  },
                  {
                    icon: <Shield className="w-8 h-8 text-purple-400" />,
                    title: "Genuine Parts",
                    sub: "OEM Warranty",
                  },
                  {
                    icon: <Wrench className="w-8 h-8 text-orange-400" />,
                    title: "Expert Service",
                    sub: "Certified Technicians",
                  },
                ].map((box, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    {box.icon}
                    <div className="font-semibold mt-2">{box.title}</div>
                    <div className="text-sm text-gray-400">{box.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 🟦 MISSION / VISION / VALUES */}
          <section className="py-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold">Our Guiding Principles</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Built on trust, service excellence and long-term partnerships.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp className="w-7 h-7 text-blue-300" />,
                  title: "Mission",
                  text: "To empower businesses with reliable transport solutions, superior uptime and transparent support.",
                },
                {
                  icon: <Award className="w-7 h-7 text-purple-300" />,
                  title: "Vision",
                  text: "To be Eastern Bihar’s most trusted commercial vehicle partner, known for excellence and innovation.",
                },
                {
                  icon: <Users className="w-7 h-7 text-green-300" />,
                  title: "Values",
                  text: "Integrity, Reliability, Speed and Customer-Centricity.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
                >
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🟧 FACILITIES */}
          <section className="py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                State-of-the-Art Facilities
              </h2>

              <p className="text-gray-300 leading-relaxed mb-8">
                Our multi-bay workshop, modern tools and expert technicians
                ensure your vehicles always get the best service with minimum
                downtime.
              </p>

              <ul className="space-y-4">
                {[
                  "OEM-grade Diagnostic Tools",
                  "Tata-Certified Technicians",
                  "Express Service Bays",
                  "24×7 Breakdown Assistance",
                  "Doorstep Service Vans",
                  "Dedicated Fleet Managers",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="text-blue-400 text-xl">✔</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <SmoothImage
              src={hero2}
              alt="Workshop Facilities"
              className="rounded-2xl shadow-xl"
            />
          </section>

          {/* 🟩 WHY BUSINESSES TRUST US */}
          <section className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold">Why Businesses Trust Us</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Comprehensive, reliable and business-focused commercial vehicle
                solutions for all segments.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "End-to-End Support",
                  desc: "Sales, finance, AMC, insurance, telematics & more.",
                },
                {
                  icon: "💰",
                  title: "Fast Finance Approvals",
                  desc: "Partnership with all major banks & NBFCs.",
                },
                {
                  icon: "⚙️",
                  title: "High Uptime Guarantee",
                  desc: "Preventive maintenance + breakdown support.",
                },
                {
                  icon: "🔩",
                  title: "100% Genuine Parts",
                  desc: "OEM quality with warranty.",
                },
                {
                  icon: "📱",
                  title: "FleetEdge Telematics",
                  desc: "Live tracking, fuel monitoring, driver behaviour.",
                },
                {
                  icon: "🚚",
                  title: "Full Range Availability",
                  desc: "SCV, Pickup, ICV, MCV, HCV, Buses.",
                },
              ].map((box) => (
                <div
                  key={box.title}
                  className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition"
                >
                  <div className="text-4xl mb-4">{box.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{box.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{box.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🟦 CTA */}
          <section className="py-20">
            <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-700 p-12 text-center shadow-xl border border-white/10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Power Your Business?
              </h2>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
                Partner with Vikramshila Automobiles for reliable Tata Motors
                commercial vehicles backed by unmatched service and support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white text-blue-900 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg flex items-center justify-center"
                >
                  Schedule a Consultation
                </Link>

                <a
                  href="/products"
                  className="px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-600 border border-blue-500"
                >
                  View Our Products
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
