import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function FinanceDocuments() {
  return (
    <div>
      <Helmet>
        <title>Finance Documents | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Check the required documents for applying finance with leading banks & NBFCs."
        />
        <link rel="canonical" href="/finance-documents" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">Finance Documents</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              To apply for finance, please keep the following documents ready
              for a smooth approval process. Explore our partners and benefits
              below.
            </p>
          </div>

          {/* Required Documents Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Required Documents</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
                <h3 className="font-semibold text-lg mb-4">Personal KYC</h3>
                <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                  <li>Aadhaar Card</li>
                  <li>PAN Card</li>
                  <li>Passport-size photographs</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
                <h3 className="font-semibold text-lg mb-4">Financial Proof</h3>
                <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                  <li>Bank statements (last 6 months)</li>
                  <li>Income proof (Salary slips / ITR)</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
                <h3 className="font-semibold text-lg mb-4">Business Proof</h3>
                <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                  <li>GST Registration / Trade License</li>
                  <li>Business address proof</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
                <h3 className="font-semibold text-lg mb-4">
                  Vehicle Documents
                </h3>
                <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                  <li>Proforma Invoice of Vehicle</li>
                  <li>Quotation from dealer</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Partners, Documents & Benefits Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Finance Assistance
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Partners */}
              <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
                <h3 className="font-semibold text-lg mb-4">Our Partners</h3>
                <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                  <li>State Bank of India</li>
                  <li>HDFC Bank</li>
                  <li>ICICI Bank</li>
                  <li>Tata Motors Finance</li>
                </ul>
              </div>

              {/* Documents */}
              <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
                <h3 className="font-semibold text-lg mb-4">
                  Documents Required
                </h3>
                <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                  <li>KYC: Aadhaar, PAN</li>
                  <li>Bank statements (6 months)</li>
                  <li>Income proof / ITR</li>
                  <li>Business proof (if applicable)</li>
                </ul>
              </div>

              {/* Benefits */}
              <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
                <h3 className="font-semibold text-lg mb-4">Benefits</h3>
                <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                  <li>Low down payment schemes</li>
                  <li>Attractive ROI</li>
                  <li>Tenure up to 60 months</li>
                  <li>Fast-track disbursals</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
