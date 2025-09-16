import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function TermsConditions() {
  return (
    <div>
      <Helmet>
        <title>Terms & Conditions | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Terms & Conditions governing the use of the Vikramshila Automobiles website and services."
        />
        <link rel="canonical" href="/terms-and-conditions" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Terms & Conditions</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              By accessing this website, you agree to the terms stated below.
              Please read them carefully.
            </p>
          </div>

          {/* Terms Blocks */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Use of Website</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Content is for general information and is subject to change
                  without notice.
                </li>
                <li>
                  Prices, offers, and specifications may vary by model,
                  location, and availability.
                </li>
                <li>
                  Unauthorized use, scraping, or misuse of site content is
                  prohibited.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Bookings & Payments
              </h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  All online payments are processed via secure payment gateways.
                </li>
                <li>
                  Booking amounts are **non-transferable** and subject to
                  OEM/dealer policies.
                </li>
                <li>
                  Statutory taxes and charges apply as per prevailing law at the
                  time of billing.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Intellectual Property
              </h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  All trademarks, logos, and content belong to their respective
                  owners.
                </li>
                <li>
                  You may not reproduce or distribute site content without
                  written permission.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Limitation of Liability
              </h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  We strive for accuracy, but errors/omissions may occur. We
                  disclaim liability for indirect or consequential losses.
                </li>
                <li>Your use of the website is at your own risk.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
