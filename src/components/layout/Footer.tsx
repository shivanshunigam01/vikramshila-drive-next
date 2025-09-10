import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Footer() {
  // 👉 Place / URLs
  const PLACE_QUERY = "Vikramshila Automobiles, Bhagalpur";
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    PLACE_QUERY
  )}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    PLACE_QUERY
  )}&hl=en&z=14&output=embed`;

  // 👉 Newsletter state/handlers (ONLY CHANGE)
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || "";

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());

  const handleSubscribe = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = email.trim();

    if (!isValidEmail(value)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (API_URL) {
        const res = await fetch(`${API_URL}/newsletter/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });
        if (!res.ok) throw new Error("Subscribe failed");
      } else {
        const k = "newsletter_emails";
        const current = JSON.parse(localStorage.getItem(k) || "[]");
        if (!current.includes(value)) current.push(value);
        localStorage.setItem(k, JSON.stringify(current));
      }

      toast({
        title: "Subscribed!",
        description: `Thanks! You'll receive updates on ${value}. — Team Vikramshila`,
      });
      setEmail("");
    } catch (err) {
      toast({
        title: "Could not subscribe",
        description: "Something went wrong. Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto grid md:grid-cols-3 gap-8 py-12">
        {/* Branches / Map */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Our Branches</h3>

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
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 8406991610
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> nagendarzee@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> WhatsApp: +91 8406991610
            </li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a aria-label="Facebook" href="#" className="hover:opacity-90">
              <Facebook />
            </a>
            <a aria-label="Instagram" href="#" className="hover:opacity-90">
              <Instagram />
            </a>
            <a aria-label="YouTube" href="#" className="hover:opacity-90">
              <Youtube />
            </a>
          </div>
        </div>

        {/* Newsletter (ONLY SECTION CHANGED) */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
          <p className="text-primary-foreground/90 text-sm mb-3">
            Get product updates, offers, and finance schemes.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              placeholder="Your email"
              className="bg-white text-foreground"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="accent" disabled={submitting}>
              {submitting ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto py-4 text-xs opacity-90 flex items-center justify-between">
          <p>
            © {new Date().getFullYear()} Vikramshila Automobiles Pvt. Ltd. All
            rights reserved.
          </p>
          <p>Authorized Tata Motors Dealership</p>
        </div>
      </div>
    </footer>
  );
}
