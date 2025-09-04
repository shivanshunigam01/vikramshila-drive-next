import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EnquiryDialog, {
  openEnquiryDialog,
} from "@/components/common/EnquiryDialog";
import { useState } from "react";
import tataLogo from "@/assets/tata-motors-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/new-launches", label: "New Launches" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* ===== Top Bar ===== */}
        <div className="w-full bg-black border-b border-gray-800">
          <div className="container mx-auto flex justify-between items-center px-4 md:px-6 py-3">
            {/* Left Side: Title */}
            <Link to="/" className="flex flex-col leading-tight pt-10 md:pt-12">
              <span className="text-lg md:text-xl font-semibold text-white tracking-wide">
                Vikramshila Automobiles
              </span>
              <span className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-widest">
                Driven by Trust. Delivered with Pride
              </span>
            </Link>

            {/* Right Side: Column with Top Links + Tata Logo */}
            <div className="flex flex-col items-end">
              {/* Top Links - visible only on desktop */}
              <div className="hidden md:flex items-center gap-6 mb-2 text-sm">
                <a
                  href="tel:18002097979"
                  className="flex items-center gap-2 px-2 py-1 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Phone className="h-4 w-4" /> <span>1800 209 7979</span>
                </a>

                <button
                  onClick={() => navigate("/truck-finder")}
                  className="flex items-center gap-2 px-2 py-1 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span>Book Your Vehicle</span>
                </button>

                {/* Book Your Service */}
                <Link
                  to="/book-service"
                  className="flex items-center gap-2 px-2 py-1 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span>Book Your Service</span>
                </Link>
                {/* Admin Login Button */}
                <Link to="http://34.68.6.114:8081/">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-4 py-2 rounded-lg shadow">
                    Admin Login
                  </Button>
                </Link>
              </div>

              {/* Tata Logo aligned with Vikramshila */}
              <div className="flex items-center">
                <img
                  src={tataLogo}
                  alt="Tata Motors Logo"
                  className="h-8 md:h-10 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Main Navigation Bar ===== */}
        <div className="w-full bg-[#1a1d20]">
          <div className="container mx-auto flex items-center justify-between h-14 px-4">
            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Contact Info (Desktop only) */}
              <a
                href="tel:+919999999999"
                className="hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Phone className="h-4 w-4" /> +91 8406991610
              </a>
              <a
                href="https://wa.me/918406991610"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 text-sm text-green-400 hover:text-green-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden p-2 text-gray-300 hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] bg-black text-white"
              >
                <div className="flex flex-col mt-6 space-y-4">
                  {/* Navigation Links */}
                  {nav.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}

                  {/* Extra Links for mobile */}

                  <a
                    href="tel:18002097979"
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <Phone className="h-4 w-4" /> 1800 209 7979
                  </a>

                  {/* Contact + WhatsApp */}
                  <a
                    href="tel:+918406991610"
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <Phone className="h-4 w-4" /> +91 8406991610
                  </a>
                  <a
                    href="https://wa.me/8406991610"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-green-400"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>

                  {/* Book Now */}
                  <Button className="bg-white text-black hover:bg-gray-200 text-sm px-4 py-2 rounded-lg shadow">
                    Book Now
                  </Button>

                  {/* Admin Login */}
                  <Link to="http://34.68.6.114:8081/">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 py-2 rounded-lg shadow w-full">
                      Admin Login
                    </Button>
                  </Link>

                  {/* Enquire Now */}
                  <Button
                    onClick={() => {
                      openEnquiryDialog();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                  >
                    Enquire Now
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <EnquiryDialog />
    </>
  );
}
