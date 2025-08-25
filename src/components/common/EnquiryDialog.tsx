"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { vehicles } from "@/data/products";

// ✅ Module-level external control
let externalOpen: ((product?: string) => void) | null = null;

export function openEnquiryDialog(product?: string) {
  if (externalOpen) externalOpen(product);
}

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  mobile: z.string().regex(/^\d{10}$/g, "Enter a valid 10-digit mobile number"),
  state: z.string().min(2, "Select your state"),
  pincode: z.string().regex(/^\d{6}$/g, "Enter a valid 6-digit pincode"),
  product: z.string().min(1, "Select a product"),
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
  const [thankYou, setThankYou] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prefillProduct, setPrefillProduct] = useState<string | undefined>();

  // ✅ Register external controller
  externalOpen = (product?: string) => {
    setPrefillProduct(product);
    setOpen(true);
  };

  const productOptions = useMemo(() => vehicles.map((v) => v.name), []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      mobile: "",
      state: "",
      pincode: "",
      product: prefillProduct || "",
      consentCall: true,
      consentWhatsApp: true,
    },
  });

  useEffect(() => {
    if (prefillProduct) form.setValue("product", prefillProduct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillProduct]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.vikramshilaautomobiles.com/api/enquiries",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: values.name,
            mobileNumber: values.mobile,
            state: values.state,
            pincode: values.pincode,
            product: values.product,
            whatsappConsent: values.consentWhatsApp,
          }),
        }
      );

      if (response.ok) {
        form.reset();
        setThankYou(true);
        setTimeout(() => {
          setThankYou(false);
          setOpen(false);
        }, 2500);
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

        {thankYou ? (
          <div className="text-center py-6">
            <h2 className="text-green-600 font-bold text-lg">🎉 Thank you!</h2>
            <p className="text-gray-700 mt-2">
              Your enquiry has been submitted successfully.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {INDIAN_STATES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {productOptions.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">
                          I agree that by clicking on 'Submit', I am explicitly
                          soliciting a call from Vikramshila Automobiles or its
                          associates on my mobile number to assist me in
                          purchasing Tata Vehicles.
                        </FormLabel>
                        <FormMessage />
                      </div>
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
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">
                          Allow Tata Motors to send you information about Tata
                          Products on WhatsApp.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
