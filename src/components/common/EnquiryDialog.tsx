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
  FormDescription,
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
import { toast } from "sonner";

export function openEnquiryDialog(product?: string) {
  window.dispatchEvent(
    new CustomEvent("open-enquiry", { detail: { product } })
  );
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
  const [prefillProduct, setPrefillProduct] = useState<string | undefined>();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { product?: string };
      setPrefillProduct(detail?.product);
      setOpen(true);
    };
    window.addEventListener("open-enquiry", handler as EventListener);
    return () =>
      window.removeEventListener("open-enquiry", handler as EventListener);
  }, []);

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

  const onSubmit = (values: z.infer<typeof schema>) => {
    toast.success("Enquiry submitted! Our team will contact you shortly.");
    setOpen(false);
    const msg = encodeURIComponent(
      `Enquiry – ${values.product}\nName: ${values.name}\nMobile: ${values.mobile}\nState: ${values.state}\nPincode: ${values.pincode}`
    );
    window.open(`https://wa.me/919999999999?text=${msg}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Enquire Now</DialogTitle>
        </DialogHeader>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <Button type="submit" variant="hero">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
