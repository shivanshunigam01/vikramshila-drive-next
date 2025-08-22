import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useState } from "react";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    setLoading(true);

    const text = encodeURIComponent(
      `New enquiry from ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`
    );
    const wa = `https://wa.me/919999999999?text=${text}`;
    window.open(wa, "_blank");

    toast({
      title: "Enquiry sent to WhatsApp",
      description: "Our team will get back to you shortly.",
    });
    setLoading(false);
    e.currentTarget.reset();
  };

  return (
    <div>
      <Helmet>
        <title>Contact Us | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Reach Vikramshila Automobiles for sales, test drives, finance and service support. Call, WhatsApp or submit the enquiry form."
        />
        <link rel="canonical" href="/contact" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Vikramshila Automobiles Pvt. Ltd.",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+91-9999999999",
                contactType: "customer service",
              },
            ],
          })}
        </script>
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl">
          We're here to help with product selection, finance, and service. Fill
          the form or reach us via phone/WhatsApp.
        </p>

        <section className="grid md:grid-cols-2 gap-8 mt-6">
          <form onSubmit={onSubmit} className="space-y-4 p-6 rounded border">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="98xxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder="Tell us about your requirement"
                rows={5}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                Send to WhatsApp
              </Button>
              <a
                href="mailto:sales@vikramshilaauto.com"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-secondary text-secondary-foreground"
              >
                Email Us
              </a>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="aspect-video rounded overflow-hidden shadow-elegant">
              <iframe
                title="Vikramshila Automobiles Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228114.3616227414!2d86.8570123!3d25.2451866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f04d9818f6dd33%3A0xd0ef9f5d7f5e7b73!2sBhagalpur%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-6 rounded border">
              <h2 className="font-semibold mb-2">Reach Us</h2>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Phone: +91 99999 99999</li>
                <li>Email: sales@vikramshilaauto.com</li>
                <li>WhatsApp: 8406991610</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
