import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function Shipping() {
  return (
    <div>
      <Helmet>
        <title>Shipping & Delivery Policy | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Learn about shipping and delivery timelines for vehicles, parts, and services from Vikramshila Automobiles."
        />
        <link rel="canonical" href="/shipping" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">
              Shipping & Delivery Policy
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Delivery processes and timelines for vehicles and parts purchased
              online/offline.
            </p>
          </div>

          {/* Policy Cards */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Vehicles</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Vehicle delivery is coordinated by our dealership team post
                  invoicing and completion of RTO/insurance formalities.
                </li>
                <li>
                  Tentative delivery timelines are communicated during booking
                  and are subject to OEM allocation and logistics.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Spare Parts & Accessories
              </h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Dispatch within **2–5 working days** for in-stock items.
                </li>
                <li>
                  Tracking details are shared where courier services are used.
                </li>
                <li>
                  Shipping charges (if any) are shown at checkout/estimate
                  stage.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Delays & Exceptions
              </h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Force majeure, supply constraints, or regulatory changes may
                  impact timelines.
                </li>
                <li>
                  We will keep you informed and provide revised timelines where
                  applicable.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Support</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  For delivery status, write to{" "}
                  <span className="text-gray-200">
                    support@vikramshilaautomobiles.com
                  </span>{" "}
                  with your order/booking ID.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
