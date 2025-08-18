import { Link, NavLink } from "react-router-dom";
import { Menu, Phone, MessageCircle, Search } from "lucide-react";
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

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* ===== Top Bar (Unchanged) ===== */}
        <div className="w-full bg-black border-b border-gray-800">
          <div className="container mx-auto flex justify-between items-center py-2 px-4">
            <Link to="/" className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-white tracking-wide">
                Vikramshila Automobiles
              </span>
              <span className="text-[11px] text-gray-400 uppercase tracking-widest">
                Driven by Trust. Delivered with Pride
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <img
                  src={tataLogo}
                  alt="Tata Motors Logo"
                  className="h-8 object-contain"
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
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-800 rounded px-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent text-sm px-2 py-1 outline-none text-gray-300 placeholder-gray-500"
                />
                <Search className="h-4 w-4 text-gray-400" />
              </div>

              {/* Buttons */}
              {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                Better Always
              </Button> */}
              {/* <Button
                variant="outline"
                className="text-blue-500 border-blue-500 text-xs hover:bg-blue-50"
              >
                Ace Pro Launch →
              </Button>
 */}
              {/* Contact Info */}
              <a
                href="tel:+919999999999"
                className="hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 99999 99999
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 text-sm text-green-400 hover:text-green-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
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
                  <a
                    href="tel:+919999999999"
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <Phone className="h-4 w-4" />
                    +91 99999 99999
                  </a>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-green-400"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <Button
                    onClick={() => {
                      openEnquiryDialog();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
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
