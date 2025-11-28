import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Helmet } from "react-helmet-async";
type FAQ = {
  category: string;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  // Vehicle Selection & Purchase
  {
    category: "Vehicle Selection & Purchase",
    question: "Which Tata commercial vehicle is best for my business?",
    answer:
      "It depends on your application. For intra-city delivery (500-900 kg), choose Tata Ace Gold. For heavy intercity loads (1500-2000 kg), Tata Intra V70 or Yodha is ideal. For passenger transport, Magic Mantra works best. Visit our showroom for a detailed consultation based on your route, load type, and budget.",
  },
  {
    category: "Vehicle Selection & Purchase",
    question: "What is the on-road price of Tata Ace Gold in Bihar?",
    answer:
      "The on-road price varies by model variant and district. Typically, Tata Ace Gold Diesel starts from ₹5.5-6.5 lakhs on-road in Bihar. Contact Vikramshila Automobiles for the latest price, offers, and exchange benefits.",
  },
  {
    category: "Vehicle Selection & Purchase",
    question: "Do you offer finance options for commercial vehicles?",
    answer:
      "Yes! We have tie-ups with leading banks and NBFCs. We offer financing with down payments as low as 10-20%, flexible tenure options, and fast approval. Our team helps you complete all documentation smoothly.",
  },
  {
    category: "Vehicle Selection & Purchase",
    question: "Can I exchange my old vehicle for a new Tata CV?",
    answer:
      "Absolutely! We accept all makes and models in exchange. Our team provides fair valuation and adjusts the exchange value against your new vehicle purchase. This reduces your upfront cost and simplifies the transition.",
  },
  {
    category: "Vehicle Selection & Purchase",
    question: "What documents are required to buy a commercial vehicle?",
    answer:
      "You need: Aadhaar Card, PAN Card, Driving License (commercial for goods vehicles), Address Proof, Bank Statements (for finance), and Passport-size Photos. For company purchases, additional documents like GST registration and business proof are required.",
  },

  // CNG Vehicles
  {
    category: "CNG Vehicles",
    question: "Are CNG commercial vehicles available in Bihar?",
    answer:
      "Yes! Tata offers several CNG models like Tata Ace Gold CNG and Magic Mantra CNG. With CNG stations expanding across Bihar (Patna, Muzaffarpur, Bhagalpur, Gaya), CNG vehicles are becoming highly viable and economical.",
  },
  {
    category: "CNG Vehicles",
    question: "What is the running cost difference between diesel and CNG?",
    answer:
      "CNG typically costs ₹2.5-3.5 per km vs ₹5-6 per km for diesel in small commercial vehicles. For a vehicle running 150 km/day, you can save ₹10,000-15,000 per month by choosing CNG over diesel.",
  },
  {
    category: "CNG Vehicles",
    question: "Is CNG vehicle maintenance more expensive?",
    answer:
      "No, CNG vehicles often have lower maintenance costs because CNG burns cleaner, causing less engine wear, carbon deposits, and oil contamination. However, CNG kit components (like regulators and valves) need periodic checks.",
  },
  {
    category: "CNG Vehicles",
    question: "What is the payload capacity of CNG vehicles?",
    answer:
      "CNG vehicles have slightly lower payload than diesel variants due to CNG cylinder weight. For example, Tata Ace CNG offers around 700-750 kg payload vs 900 kg in diesel. However, the fuel savings often outweigh this difference.",
  },

  // Financing & Insurance
  {
    category: "Financing & Insurance",
    question: "What is the minimum down payment for a Tata commercial vehicle?",
    answer:
      "Down payment typically ranges from 10% to 25% depending on the lender, your credit profile, and vehicle model. For a ₹6 lakh vehicle, expect a down payment of ₹60,000 to ₹1.5 lakhs.",
  },
  {
    category: "Financing & Insurance",
    question: "How long does loan approval take?",
    answer:
      "With complete documentation, loan approval can happen within 24-48 hours. Some NBFCs offer instant in-principle approval. Final disbursement takes 3-5 working days.",
  },
  {
    category: "Financing & Insurance",
    question: "Is insurance included in the on-road price?",
    answer:
      "Yes, the on-road price includes basic third-party insurance (mandatory by law). You can opt for comprehensive insurance for better coverage against theft, accidents, and damages, which costs extra.",
  },
  {
    category: "Financing & Insurance",
    question: "What does comprehensive insurance cover?",
    answer:
      "Comprehensive insurance covers third-party liability, own damage (accidents, theft, fire, natural calamities), and personal accident cover for the driver. It provides complete peace of mind for fleet owners.",
  },

  // Service & Maintenance
  {
    category: "Service & Maintenance",
    question: "Where is the nearest Tata service center?",
    answer:
      "Vikramshila Automobiles operates authorized Tata service centers across Bihar. Check our website or call our helpline for the nearest center based on your location. We also offer doorstep service for minor repairs.",
  },
  {
    category: "Service & Maintenance",
    question: "How often should I service my Tata commercial vehicle?",
    answer:
      "For optimal performance, service your vehicle every 10,000 km or 6 months (whichever is earlier). For high-usage fleets, consider a 7,500 km service interval. Regular servicing improves mileage, reliability, and resale value.",
  },
  {
    category: "Service & Maintenance",
    question: "What is an Annual Maintenance Contract (AMC)?",
    answer:
      "AMC is a prepaid service package covering all scheduled maintenance, labor charges, and periodic parts replacement for a year. It converts unpredictable repair costs into a fixed expense and ensures zero downtime.",
  },
  {
    category: "Service & Maintenance",
    question: "Do you provide genuine Tata spare parts?",
    answer:
      "Yes, all our service centers use 100% genuine Tata spare parts. Genuine parts ensure better fit, longer life, warranty coverage, and optimal vehicle performance compared to aftermarket alternatives.",
  },
  {
    category: "Service & Maintenance",
    question: "What should I do if my vehicle breaks down on the highway?",
    answer:
      "Call our 24×7 roadside assistance helpline immediately. We provide emergency support including towing, on-site repairs, and alternative transport arrangements. Keep your vehicle registration and customer ID handy.",
  },

  // Mileage & Performance
  {
    category: "Mileage & Performance",
    question: "What is the real-world mileage of Tata Ace Gold?",
    answer:
      "Tata Ace Gold Diesel typically delivers 16-20 kmpl depending on load, driving habits, road conditions, and maintenance. CNG variant offers 20-24 km/kg equivalent, translating to better operating economics.",
  },
  {
    category: "Mileage & Performance",
    question: "How can I improve my vehicle's mileage?",
    answer:
      "Maintain correct tyre pressure, avoid sudden acceleration/braking, service regularly, don't overload, use the right gear at right RPM, minimize idling, and ensure proper wheel alignment. These habits can improve mileage by 10-15%.",
  },
  {
    category: "Mileage & Performance",
    question: "Does overloading affect vehicle life and mileage?",
    answer:
      "Yes, significantly. Overloading strains the engine, transmission, brakes, and suspension. It reduces mileage by 15-25%, accelerates wear, increases breakdown risk, and can void your warranty.",
  },
  {
    category: "Mileage & Performance",
    question: "What is the maximum speed of Tata commercial vehicles?",
    answer:
      "Most Tata SCVs and LCVs have a top speed of 80-100 kmph (governed for safety and fuel efficiency). However, the optimal cruising speed for best mileage is 50-60 kmph on highways.",
  },

  // Telematics & Technology
  {
    category: "Telematics & Technology",
    question: "What is Tata FleetEdge?",
    answer:
      "FleetEdge is Tata Motors' telematics platform offering real-time GPS tracking, driver behavior monitoring, fuel analytics, route optimization, maintenance alerts, and trip reports—all accessible via mobile app or web dashboard.",
  },
  {
    category: "Telematics & Technology",
    question: "How does FleetEdge help reduce operating costs?",
    answer:
      "FleetEdge helps detect fuel theft, monitor unauthorized vehicle use, reduce empty trips, optimize routes, improve driver behavior, and schedule preventive maintenance—together reducing total operating costs by 10-20%.",
  },
  {
    category: "Telematics & Technology",
    question: "Is FleetEdge subscription mandatory?",
    answer:
      "No, FleetEdge is optional. However, fleet owners with 3+ vehicles find it highly valuable for improving profitability, safety, and efficiency. The monthly subscription cost is minimal compared to the savings it generates.",
  },

  // Permits & Documentation
  {
    category: "Permits & Documentation",
    question:
      "What permits do I need to operate a commercial vehicle in Bihar?",
    answer:
      "You need a national permit for inter-state operations or a state permit for intra-Bihar operations. For passenger vehicles, a stage carriage or contract carriage permit is required based on your usage.",
  },
  {
    category: "Permits & Documentation",
    question: "How long does it take to get vehicle registration?",
    answer:
      "Temporary registration (TR) is provided immediately for 1-2 months. Permanent registration typically takes 30-60 days. Our team assists with all RTO formalities to ensure smooth and fast registration.",
  },
  {
    category: "Permits & Documentation",
    question: "Do I need a commercial driving license for Tata Ace?",
    answer:
      "Yes, since Tata Ace is a goods carrier commercial vehicle, you need a Light Motor Vehicle (LMV) commercial license or a Transport Vehicle license to operate it legally.",
  },

  // After-Sales Support
  {
    category: "After-Sales Support",
    question: "Do you offer doorstep service?",
    answer:
      "Yes, we offer free pickup and drop for periodic service within city limits. For breakdowns, our mobile service van can reach your location for minor repairs and emergency support.",
  },
  {
    category: "After-Sales Support",
    question: "What is the warranty period for new Tata vehicles?",
    answer:
      "Tata commercial vehicles come with a standard 2-year/2 lakh km warranty (whichever is earlier). Extended warranty packages are also available for additional peace of mind and coverage.",
  },
  {
    category: "After-Sales Support",
    question: "Can I track my service appointment online?",
    answer:
      "Yes! You can book service appointments online through our website or call our customer care. We also send SMS and WhatsApp updates on your vehicle's service status and estimated completion time.",
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredFAQs =
    selectedCategory === "All"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-black text-white font-sans">
      <Helmet>
        <title>
          Frequently Asked Questions | Tata Commercial Vehicles | Vikramshila
          Automobiles
        </title>
        <meta
          name="description"
          content="Get answers to common questions about Tata Motors commercial vehicles, finance, EMI, warranty, service and vehicle selection at Vikramshila Automobiles."
        />
        <link rel="canonical" href="https://vikramshilaautomobiles.com/faq" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f: any) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
              },
            })),
          })}
        </script>
      </Helmet>
      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 py-4 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-blue-400 hover:text-blue-500">
              Home
            </Link>
          </li>
          <li className="text-gray-400">›</li>
          <li className="text-white font-medium">FAQ</li>
        </ol>
      </nav>

      {/* Hero */}
      <div
        className="relative h-[320px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-300">
              Find answers to common questions about Tata commercial vehicles.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Category Filter */}
        <div className="mb-12 text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Browse by Category
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === "All"
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              All Questions
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-blue-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#111] border border-gray-800 rounded-lg transition hover:border-gray-700"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-start justify-between text-left"
              >
                <div className="flex-1 pr-4">
                  <span className="text-xs text-blue-400 uppercase tracking-wider block mb-2">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                </div>

                <ChevronDown
                  className={`w-6 h-6 text-gray-400 transition ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 bg-blue-900/20 border border-blue-800/50 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Our expert team is here to help you choose the right commercial
            vehicle for your business needs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700"
            >
              Contact Us
            </Link>

            <a
              href="tel:+919876543210"
              className="bg-gray-800 px-8 py-3 rounded-lg hover:bg-gray-700"
            >
              Call: +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
