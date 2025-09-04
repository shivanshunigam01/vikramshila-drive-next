"use client";

import { useState, useEffect } from "react";
import {
  sendGrievanceService,
  GrievancePayload,
} from "@/services/grievance.service";

export default function GrievanceForm() {
  // Example logged-in user from localhost

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [formData, setFormData] = useState<GrievancePayload>({
    fullName: user.name || "",
    mobileNumber: user.phone || "",
    state: "",
    pincode: "",
    briefDescription: "",
    whatsappConsent: true,
    grievanceType: "",
    description: "",
    consentCall: true,
    email: user.email || "", // 👈 auto-filled from logged-in user
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: GrievancePayload = { ...formData };

      await sendGrievanceService(payload);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setFormData({
        fullName: user.name || "",
        mobileNumber: user.phone || "",
        state: "",
        pincode: "",
        briefDescription: "",
        whatsappConsent: true,
        grievanceType: "",
        description: "",
        consentCall: true,
        email: user.email || "", // reset with logged-in user
      });
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        Submit a Grievance
      </h2>

      {success && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 transition-all duration-300">
          ✅ Your grievance has been submitted successfully. Our team will reach
          out within 6 hours.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-xl shadow-lg max-w-3xl mx-auto space-y-4 border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Email - auto-filled & read-only */}
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="p-3 rounded-md bg-gray-700 text-gray-300 cursor-not-allowed"
          />

          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select State</option>
            <option>Andhra Pradesh</option>
            <option>Gujarat</option>
            <option>Karnataka</option>
            <option>Maharashtra</option>
          </select>

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Grievance Type */}
        <select
          name="grievanceType"
          value={formData.grievanceType}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Grievance Type</option>
          <option value="complaint">Complaint</option>
          <option value="feedback">Feedback</option>
          <option value="suggestion">Suggestion</option>
        </select>

        {/* Brief Description */}
        <textarea
          name="briefDescription"
          value={formData.briefDescription}
          onChange={handleChange}
          placeholder="Brief description..."
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          required
        />

        {/* Detailed Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed grievance explanation..."
          className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
        />

        {/* WhatsApp Consent */}
        <label className="flex items-center gap-2 text-white text-sm">
          <input
            type="checkbox"
            name="whatsappConsent"
            checked={formData.whatsappConsent}
            onChange={handleChange}
            className="accent-blue-500"
          />
          Allow us to contact you on WhatsApp.
        </label>

        {/* Call Consent */}
        <label className="flex items-center gap-2 text-white text-sm">
          <input
            type="checkbox"
            name="consentCall"
            checked={formData.consentCall}
            onChange={handleChange}
            className="accent-blue-500"
          />
          Allow us to call you regarding this grievance.
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold text-white text-lg mt-2"
        >
          {loading ? "Submitting..." : "Submit Grievance"}
        </button>
      </form>
    </div>
  );
}
