import { Facebook, Instagram, Youtube, Mail, Phone, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto grid md:grid-cols-3 gap-8 py-12">
        <div>
          <h3 className="text-lg font-semibold mb-3">Our Branches</h3>
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
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 99999 99999</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> sales@vikramshilaauto.com</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp: 99999 99999</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a aria-label="Facebook" href="#" className="hover:opacity-90"><Facebook /></a>
            <a aria-label="Instagram" href="#" className="hover:opacity-90"><Instagram /></a>
            <a aria-label="YouTube" href="#" className="hover:opacity-90"><Youtube /></a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
          <p className="text-primary-foreground/90 text-sm mb-3">Get product updates, offers, and finance schemes.</p>
          <div className="flex gap-2">
            <Input placeholder="Your email" className="bg-white text-foreground" />
            <Button variant="accent">Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto py-4 text-xs opacity-90 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Vikramshila Automobiles Pvt. Ltd. All rights reserved.</p>
          <p>Authorized Tata Motors Dealership</p>
        </div>
      </div>
    </footer>
  );
}
