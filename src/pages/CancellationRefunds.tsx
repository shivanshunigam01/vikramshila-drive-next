import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function CancellationRefunds() {
  return (
    <div>
      <Helmet>
        <title>Cancellation & Refund Policy | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Read the Cancellation & Refund Policy for purchases and services at Vikramshila Automobiles."
        />
        <link rel="canonical" href="/cancellation-refunds" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-6">
          {/* Page Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our policy explains when cancellations or refunds may be
              applicable for vehicles, parts, services, and online payments.
            </p>
          </div>

          {/* Policy Sections */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">General</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Orders for vehicles/services once confirmed are
                  **non-cancellable** unless explicitly stated in the booking
                  terms.
                </li>
                <li>
                  Refunds (if applicable) are processed only for duplicate
                  payments, failed transactions, or where delivery of service is
                  not initiated.
                </li>
                <li>
                  Proof of payment and transaction reference is mandatory for
                  any refund request.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Refund Timelines</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Approved refunds are initiated within **7–10 working days**.
                </li>
                <li>
                  The credit may reflect in your account as per your
                  bank/issuer’s processing timelines.
                </li>
                <li>
                  No cash refunds. Refunds are returned to the original payment
                  method.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">How to Request</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Email your request with order/booking ID, date, and payment
                  reference to
                  <span className="text-gray-200">
                    {" "}
                    support@vikramshilaautomobiles.com
                  </span>
                  .
                </li>
                <li>
                  We may request KYC/bank details for verification where
                  required.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-gray-700 bg-[#1e2125] shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Exclusions</h2>
              <ul className="space-y-2 list-disc pl-5 text-gray-300 text-base">
                <li>
                  Registration, insurance, RTO fees, and statutory charges are
                  non-refundable.
                </li>
                <li>
                  Custom-ordered parts or items procured specifically on request
                  are non-returnable.
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
