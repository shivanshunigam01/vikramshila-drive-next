export default function EnquiryForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      {/* Blue Border Wrapper */}
      <div className="w-full max-w-7xl px-8">
        <form
          onSubmit={handleSubmit}
          className="w-full p-10 border-4 border-blue-500 rounded-lg shadow-lg bg-black text-white"
        >
          {/* Title */}
          <h2 className="text-4xl font-bold text-center mb-3">Enquire Now</h2>
          <p className="text-center text-gray-300 mb-10 text-lg">
            Tata Motors offers a range of services keeping in mind the comfort
            and convenience.
          </p>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              className="p-4 rounded-md bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="p-4 rounded-md bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="p-4 rounded-md bg-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select State</option>
              <option>Maharashtra</option>
              <option>Gujarat</option>
              <option>Karnataka</option>
            </select>
            <input
              type="text"
              placeholder="Enter Pincode"
              className="p-4 rounded-md bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="p-4 rounded-md bg-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Product</option>
              <option>Ace Pro</option>
              <option>Pickup</option>
              <option>LCV</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="mt-8 space-y-3 text-sm">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 text-blue-500"
              />
              <span>
                I agree that by clicking on 'Submit', I am explicitly soliciting
                a call from Tata Motors or its associates.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 text-blue-500"
              />
              <span>
                Allow Tata Motors to send you information about Tata Products on
                WhatsApp.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold text-lg"
            >
              Submit →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
