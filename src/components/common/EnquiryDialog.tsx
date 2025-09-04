"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { sendEnquiryService } from "@/services/enquiry.service";
import { Textarea } from "../ui/textarea";

let externalOpen: (() => void) | null = null;

export function openEnquiryDialog(title: any) {
  if (externalOpen) externalOpen();
}

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  mobile: z.string().regex(/^\d{10}$/g, "Enter a valid 10-digit mobile number"),
  state: z.string().min(2, "Select your state"),
  pincode: z.string().regex(/^\d{6}$/g, "Enter a valid 6-digit pincode"),
  briefDescription: z.string().min(5, "Please add a brief description"),
  consentCall: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
  consentWhatsApp: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
});

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function EnquiryDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  externalOpen = () => setOpen(true);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      mobile: "",
      state: "",
      pincode: "",
      briefDescription: "",
      consentCall: true,
      consentWhatsApp: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      const response = await sendEnquiryService({
        fullName: values.name,
        mobileNumber: values.mobile,
        state: values.state,
        pincode: values.pincode,
        briefDescription: values.briefDescription,
        whatsappConsent: values.consentWhatsApp,
      });
      debugger;
      if (response.data.success) {
        form.reset();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setOpen(false);
        }, 3000); // Close after 3 seconds
      } else {
        alert("❌ Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Enquire Now
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-6">
            <h2 className="text-green-600 font-bold text-lg">
              🎉 Enquiry Submitted!
            </h2>
            <p className="text-gray-700 mt-2">
              Our team will reach out within 6 hours.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Mobile Number"
                          inputMode="numeric"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <select
                          className="w-full border rounded p-2"
                          {...field}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter Pincode"
                          inputMode="numeric"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="briefDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="consentCall"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I agree to receive a call from Vikramshila Automobiles.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consentWhatsApp"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Allow Tata Motors to send information via WhatsApp.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
