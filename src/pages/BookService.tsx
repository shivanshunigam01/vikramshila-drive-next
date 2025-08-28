import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";
import { createServiceBooking } from "@/services/serviceBookingServices";

export default function BookService() {
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState("");
  const [pickupRequired, setPickupRequired] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    const serviceFromUrl = searchParams.get("service");
    if (serviceFromUrl) {
      setSelectedService(serviceFromUrl);
    }
  }, [searchParams]);

  const disableSundays = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate.getDay() === 0) {
      alert("Workshop is closed on Sundays. Please select another date.");
      e.target.value = "";
    }
  };

  const validateForm = (form: HTMLFormElement) => {
    const errors: any = {};
    const phone = form["phone"]?.value.trim();
    const email = form["email"]?.value.trim();

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      errors.phone = "Enter a valid 10-digit mobile number";
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!validateForm(form)) return;

    try {
      const formData = new FormData(form);
      let payload: any;

      if (
        formData.get("attachment") &&
        (formData.get("attachment") as File).size > 0
      ) {
        payload = formData;
      } else {
        const jsonData: Record<string, any> = {};
        formData.forEach((val, key) => {
          jsonData[key] = val;
        });
        payload = jsonData;
      }

      const res = await createServiceBooking(payload);

      if (res.status === 200 || res.status === 201) {
        toast({
          title: "🎉 Thank You!",
          description:
            "Your service has been booked successfully. Our executive will contact you shortly.",
        });
        form.reset();
        setPickupRequired(false);
        setFormErrors({});
      }
    } catch (err: any) {
      toast({
        title: "❌ Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
      console.error("Booking error:", err);
    }
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-5xl px-6">
          <form
            onSubmit={handleSubmit}
            className="w-full p-6 md:p-8 border-4 border-blue-500 rounded-lg shadow-lg bg-black text-white"
          >
            <h2 className="text-2xl md:text-2xl font-bold text-center mb-2">
              🚚 Book Service Now
            </h2>
            <p className="text-center text-gray-300 mb-6 text-sm md:text-base">
              Please fill out the form to book a service appointment with Tata
              Motors.
            </p>

            {/* 1. Customer Information */}
            <h3 className="text-lg md:text-sm font-semibold mb-2">
              1. Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Full Name *"
                name="name"
                required
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Mobile Number *"
                name="phone"
                required
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address (Optional)"
                name="email"
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 2. Vehicle Information */}
            <h3 className="text-lg md:text-sm font-semibold mb-2">
              2. Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Vehicle Registration Number *"
                name="registrationNumber"
                required
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Chassis No / Last 5 Digits of VIN (Optional)"
                name="chassis"
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="modelVariant"
                required
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-black border border-gray-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Model / Variant *</option>
                <option>Ace Gold</option>
                <option>Intra V50/V70</option>
                <option>Yodha</option>
                <option>LCV</option>
                <option>ICV</option>
                <option>MCV</option>
                <option>Buses</option>
                <option>Winger</option>
                <option>Magic</option>
              </select>
              <input
                type="number"
                placeholder="Odometer Reading (km)"
                name="odo"
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 3. Service Requirements */}
            <h3 className="text-lg md:text-sm font-semibold mb-2">
              3. Service Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="serviceType"
                required
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-black border border-gray-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Service Type *</option>
                <option>Periodic Service</option>
                <option>Running Repair</option>
                <option>Body Repair</option>
                <option>Electrical</option>
                <option>Accidental</option>
                <option>Other</option>
              </select>
              <select
                name="servicePackage"
                required
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-black border border-gray-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Preferred Service Package *</option>
                <option>Preventive Maintenance</option>
                <option>AMC</option>
                <option>Warranty</option>
                <option>General</option>
              </select>
            </div>
            <textarea
              name="notes"
              placeholder="Problem Description / Complaints"
              className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500 w-full"
              rows={3}
            />

            {/* 4. Appointment Preferences */}
            <h3 className="text-lg md:text-sm font-semibold mt-4 mb-2">
              4. Appointment Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="date"
                name="appointmentDate"
                required
                onChange={disableSundays}
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="timeSlot"
                required
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-black border border-gray-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Preferred Time Slot *</option>
                <option>Morning (9–12)</option>
                <option>Afternoon (12–3)</option>
                <option>Evening (3–6)</option>
              </select>
            </div>

            {/* Pickup & Drop */}
            <div className="mb-4 text-xs md:text-sm">
              <label className="mr-2">Pickup & Drop Required?</label>
              <label className="mr-2">
                <input
                  type="radio"
                  name="pickupRequired"
                  value="yes"
                  onChange={() => setPickupRequired(true)}
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="pickupRequired"
                  value="no"
                  onChange={() => setPickupRequired(false)}
                />{" "}
                No
              </label>
            </div>

            {pickupRequired && (
              <input
                type="text"
                name="address"
                placeholder="Pickup/Drop Location *"
                required
                className="mb-4 p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-transparent border border-gray-500 focus:ring-2 focus:ring-blue-500 w-full"
              />
            )}

            {/* Additional Features */}
            <h3 className="text-lg md:text-sm font-semibold mb-2">
              5. Additional Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="file"
                name="attachment"
                className="p-2 text-xs placeholder:text-xs md:text-sm md:placeholder:text-sm rounded-md bg-black border border-gray-500"
              />
              <label className="flex items-center gap-2 text-xs md:text-sm">
                <input type="checkbox" name="estimate" /> Request Estimate in
                Advance?
              </label>
            </div>

            {/* Consent */}
            <div className="mt-4 space-y-2 text-xs md:text-sm">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="agree"
                  required
                  className="mt-1 text-blue-500"
                />
                <span>
                  I agree to share my vehicle details for service booking.
                </span>
              </label>
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 md:px-8 md:py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold text-xs md:text-sm"
              >
                Book Service Now →
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
