import { useState } from "react";
import { sendEnquiryService, EnquiryPayload } from "@/services/enquiry.service";

export default function EnquiryForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const data: EnquiryPayload = {
      fullName: form.fullName.value,
      mobileNumber: form.mobileNumber.value,
      state: form.state.value,
      pincode: form.pincode.value,
      whatsappConsent: form.whatsappConsent.checked,
      briefDescription: form.briefDescription?.value || "",
    };

    try {
      const response = await sendEnquiryService(data);

      if (response.data.success) {
        setShowSuccess(true);
        form.reset();

        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("❌ Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-7xl px-8 relative">
        <form
          onSubmit={handleSubmit}
          className="w-full p-10 border-4 border-blue-500 rounded-lg shadow-lg bg-black text-white"
        >
          <h2 className="text-4xl font-bold text-center mb-3">Enquire Now</h2>
          <p className="text-center text-gray-300 mb-10 text-lg">
            Tata Motors offers a range of services keeping in mind the comfort
            and convenience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="p-4 rounded-md bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="mobileNumber"
              type="tel"
              placeholder="Mobile Number"
              className="p-4 rounded-md bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="state"
              className="p-4 rounded-md bg-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select State</option>
              <option>Maharashtra</option>
              <option>Gujarat</option>
              <option>Karnataka</option>
            </select>
            <input
              name="pincode"
              type="text"
              placeholder="Enter Pincode"
              className="p-4 rounded-md bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="briefDescription"
              placeholder="Add a brief description (optional)"
              className="p-4 rounded-md bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            />
          </div>

          <div className="mt-8 space-y-3 text-sm">
            <label className="flex items-start space-x-2">
              <input
                name="callConsent"
                type="checkbox"
                defaultChecked
                className="mt-1 text-blue-500"
                required
              />
              <span>
                I agree that by clicking on 'Submit', I am explicitly soliciting
                a call from Tata Motors or its associates.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                name="whatsappConsent"
                type="checkbox"
                defaultChecked
                className="mt-1 text-blue-500"
                required
              />
              <span>
                Allow Tata Motors to send you information about Tata Products on
                WhatsApp.
              </span>
            </label>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit →"}
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold mb-2">🎉 Enquiry Submitted!</h3>
              <p>Our team will reach out within 6 hours.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
