import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  Phone,
  MessageCircle,
  ChevronDown,
  Search,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EnquiryDialog, {
  openEnquiryDialog,
} from "@/components/common/EnquiryDialog";
import { useState } from "react";

import Chatbot from "@/components/common/Chatbot";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About", hasDropdown: true },
  { to: "/products", label: "Products", hasDropdown: true },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [activeNav, setActiveNav] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Main header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        {/* Tata Motors brand bar */}
        <div className="w-full border-b bg-background/90">
          <div className="container mx-auto flex justify-end py-2">
            
            <div className="flex flex-col items-end gap-1">
              <img
                src="/images/tata-motors-logo.svg"
                alt="Tata Motors Commercial Vehicles - Better Always"
                className="h-6 w-auto"
                loading="lazy"
                width="120"
                height="24"
              />
              <Link to="/" className="flex flex-col items-end">
                <span className="text-xl font-bold tracking-tight">
                  Vikramshila Automobiles
                </span>
                <span className="text-xs text-muted-foreground">
                  Driven by Trust. Delivered with Pride
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="w-full bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              {/* Left spacer */}
              <div></div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {nav.map((item) => (
                  <div key={item.to} className="relative group">
                    <NavLink
                      to={item.to}
                      onClick={() => setActiveNav(item.to)}
                      className={({ isActive }) =>
                        `flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white rounded ${
                          isActive ? "text-gray-900 bg-white" : "text-gray-700"
                        }`
                      }
                    >
                      {item.label}
                      {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                    </NavLink>
                  </div>
                ))}
              </nav>

              {/* Right side actions */}
              <div className="flex items-center gap-3 ml-4">
                <a
                  href="tel:+919999999999"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +91 99999 99999
                </a>

                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>

                {/* <Button
                  onClick={() => openEnquiryDialog()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Enquire Now
                </Button> */}
              </div>

              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    {nav.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        {item.label}
                        {item.hasDropdown && (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </NavLink>
                    ))}

                    <div className="pt-4 border-t space-y-3">
                      {/* Mobile top bar items */}
                      <div className="flex flex-wrap gap-2">
                        <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-medium">
                          Safer Always
                        </button>
                        <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-medium">
                          Alternate Fuels
                        </button>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1.5 rounded text-xs">
                          <Globe className="h-3 w-3" />
                          <span>en</span>
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>

                      <a
                        href="tel:+919999999999"
                        className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2"
                      >
                        <Phone className="h-4 w-4" />
                        +91 99999 99999
                      </a>

                      <a
                        href="https://wa.me/919999999999"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-green-600 px-3 py-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>

                      <Button
                        onClick={() => {
                          openEnquiryDialog();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Enquire Now
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <EnquiryDialog />
      
    </>
  );
}
