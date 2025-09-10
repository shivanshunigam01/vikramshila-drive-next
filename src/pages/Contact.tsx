import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FormEvent, useState } from "react";
import { MapPin } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // 👉 Place / URLs (same behavior as your Footer)
  const PLACE_QUERY = "Vikramshila Automobiles, Bhagalpur";
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    PLACE_QUERY
  )}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    PLACE_QUERY
  )}&hl=en&z=14&output=embed`;

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
                telephone: "+91-8406991610",
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
          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="space-y-4 p-6 rounded border bg-background"
          >
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
                href="mailto:nagendarzee@gmail.com"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-secondary text-secondary-foreground"
              >
                Email Us
              </a>
            </div>
          </form>
          {/* Clickable map */}
          <div className="relative aspect-video rounded overflow-hidden shadow-elegant group">
            {/* The iframe renders the map visually */}
            <iframe
              title={PLACE_QUERY}
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full pointer-events-none" // ensure our overlay handles clicks
            />
            {/* Full-size overlay link so any click goes to Google Maps */}
            <a
              aria-label={`Open ${PLACE_QUERY} in Google Maps`}
              href={mapsSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute inset-0"
            />

            {/* Small CTA pill */}
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs text-white border border-white/15 opacity-90 group-hover:opacity-100 transition"
            >
              <MapPin className="h-3.5 w-3.5" />
              Open in Maps
            </a>
          </div>
          s
        </section>
      </main>

      <Footer />
    </div>
  );
}
