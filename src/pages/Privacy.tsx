import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function Privacy() {
  return (
    <div>
      <Helmet>
        <title>Privacy Policy | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Privacy Policy explaining how Vikramshila Automobiles collects, uses, and safeguards your data."
        />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              How we collect, use, share, and protect your personal information.
            </p>
          </div>

          {/* Policy Grid */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Contact details (name, phone, email), address, and vehicle
                  preferences.
                </li>
                <li>
                  Transaction data related to bookings, invoices, test drives,
                  and services.
                </li>
                <li>
                  Analytics/usage data (cookies, device information) to improve
                  site experience.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">How We Use Data</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  To process bookings, finance assistance, and service requests.
                </li>
                <li>
                  To communicate offers, updates, and service reminders (with
                  consent).
                </li>
                <li>To comply with legal and regulatory requirements.</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                Sharing & Security
              </h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  We do not sell personal data. Limited sharing with OEM,
                  finance, insurance, and service partners happens strictly to
                  fulfil your request.
                </li>
                <li>
                  We employ reasonable technical and organizational security
                  measures.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Your Choices</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  To access, correct, or delete your data, email{" "}
                  <span className="text-gray-200">
                    privacy@vikramshilaautomobiles.com
                  </span>
                  .
                </li>
                <li>You may opt-out of marketing communications anytime.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
