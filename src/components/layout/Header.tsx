import { Link, NavLink } from "react-router-dom";
import { Menu, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EnquiryDialog, { openEnquiryDialog } from "@/components/common/EnquiryDialog";
import Chatbot from "@/components/common/Chatbot";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/finance", label: "Finance" },
  { to: "/offers", label: "Offers" },
  { to: "/videos", label: "Videos" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Tata Motors brand bar */}
      <div className="w-full border-b bg-background/90">
        <div className="container mx-auto flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <img
              src="/images/tata-motors-logo.svg"
              alt="Tata Motors Commercial Vehicles - Better Always"
              className="h-6 w-auto"
              loading="lazy"
              width="120"
              height="24"
            />
          </div>
          <img
            src="/images/tata-logo.svg"
            alt="Tata logo"
            className="h-6 w-auto"
            loading="lazy"
            width="32"
            height="24"
          />
        </div>
      </div>
      <div className="container mx-auto flex items-center justify-between py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">Vikramshila Automobiles</span>
            <span className="text-xs text-muted-foreground">Driven by Trust. Delivered with Pride</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end className={({ isActive }) => isActive ? "text-primary font-medium story-link" : "text-foreground/80 hover:text-foreground story-link"}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+919999999999" className="flex items-center gap-2 text-sm hover-scale">
            <Phone className="h-4 w-4" /> +91 99999 99999
          </a>
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover-scale">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <Button variant="hero" className="ml-2" onClick={() => openEnquiryDialog()}>Enquire Now</Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="px-2 py-4 space-y-2">
                {nav.map((n) => (
                  <NavLink key={n.to} to={n.to} end className={({ isActive }) => isActive ? "block px-2 py-2 rounded bg-secondary" : "block px-2 py-2 rounded hover:bg-secondary"}>
                    {n.label}
                  </NavLink>
                ))}
                <div className="pt-2 flex flex-col gap-2">
                  <a href="tel:+919999999999" className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" /> +91 99999 99999
                  </a>
                  <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <Button variant="accent" onClick={() => openEnquiryDialog()}>Enquire Now</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <EnquiryDialog />
      <Chatbot />
    </header>
  );
}