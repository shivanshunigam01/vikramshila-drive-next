import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModalWrapper from "@/components/ui/ModalWrapper";
import contactBanner from "../../assets/contact_page.webp";
import GrievanceForm from "../common/GrievanceForm";

export default function ContactPage() {
  const [openGrievance, setOpenGrievance] = useState(false);

  return (
    <div className="bg-black text-white font-sans">
      <Header />

      <nav className="max-w-7xl mx-auto px-6 py-4 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
          </li>
          <li className="text-gray-400">›</li>
          <li className="text-white font-medium">Contact</li>
        </ol>
      </nav>

      <div
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${contactBanner})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-3xl text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-300">
            We’re here to help. Reach out to us anytime for sales, service, or
            support.
          </p>

          {/* ✅ Grievance Button */}
          <button
            onClick={() => setOpenGrievance(true)}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white text-lg"
          >
            Submit Grievance
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div className="rounded-lg overflow-hidden shadow-lg aspect-video">
          <iframe
            title="Bhagalpur Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228114.3616227414!2d86.8570123!3d25.2451866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f04d9818f6dd33%3A0xd0ef9f5d7f5e7b73!2sBhagalpur%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-gray-300">
            Have a question or need support? Contact us via phone, email, or
            WhatsApp.
          </p>
          <ul className="space-y-3 text-lg">
            <li>📞 +91 8406991610</li>
            <li>✉️ nagendarzee@gmail.com</li>
            <li>💬 WhatsApp: +91 8406991610</li>
          </ul>
        </div>
      </div>

      {/* Modal for Grievance Form */}
      <ModalWrapper
        open={openGrievance}
        onClose={() => setOpenGrievance(false)}
      >
        <GrievanceForm />
      </ModalWrapper>

      <Footer />
    </div>
  );
}
