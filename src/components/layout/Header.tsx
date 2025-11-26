import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, Phone, MessageCircle, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EnquiryDialog, {
  openEnquiryDialog,
} from "@/components/common/EnquiryDialog";
import { useEffect, useMemo, useRef, useState } from "react";
import tataLogo from "@/assets/tata-motors-logo.png";
import AuthModal from "@/components/auth/AuthModal";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/new-launches", label: "New Launches" },
  { to: "/contact", label: "Contact" },
  { to: "/blogs", label: "Blogs" },
  { to: "/faq", label: "FAQ" },
];

const ADMIN_URL = "http://13.216.195.152:8081/";

type AuthState = {
  loggedIn: boolean;
  isAdmin: boolean;
  name: string | null;
};

function getFirstName(name?: string | null) {
  if (!name) return "";
  return String(name).trim().split(" ")[0];
}

function readAuthFromStorage(): AuthState {
  let userName: string | null = null;
  let isAdmin = false;
  try {
    const userRaw =
      localStorage.getItem("user") ||
      localStorage.getItem("admin_user") ||
      null;
    if (userRaw) {
      const u = JSON.parse(userRaw);
      userName = u?.name || u?.username || u?.email || null;
      if (u?.role === "admin") isAdmin = true;
    }
  } catch {}
  const hasAdminToken = !!localStorage.getItem("admin_token");
  const hasGenericToken = !!localStorage.getItem("token"); // legacy
  const hasCustomerToken = !!localStorage.getItem("customer_token"); // OTP flow
  if (!userName && hasAdminToken) userName = "Admin";
  return {
    loggedIn: !!(
      userName ||
      hasAdminToken ||
      hasGenericToken ||
      hasCustomerToken
    ),
    isAdmin: isAdmin || hasAdminToken,
    name: userName,
  };
}

// simple click-outside hook
function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  onClose: () => void
) {
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [ref, onClose]);
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // dropdowns now open by CLICK (no hover)
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const loginMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(loginMenuRef, () => setLoginMenuOpen(false));
  useClickOutside(userMenuRef, () => setUserMenuOpen(false));

  const [auth, setAuth] = useState<AuthState>(readAuthFromStorage());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setAuth(readAuthFromStorage());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleAuthSuccess = () => {
    setAuth(readAuthFromStorage());
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    const known = [
      "admin_token",
      "admin_user",
      "token", // legacy
      "customer_token", // OTP flow
      "user",
      "payCalculatorInputs",
    ];
    known.forEach((k) => localStorage.removeItem(k));
    const sweep: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || "";
      if (/token|auth|user/i.test(k)) sweep.push(k);
    }
    sweep.forEach((k) => localStorage.removeItem(k));
    setAuth(readAuthFromStorage());
    setUserMenuOpen(false);
    setLoginMenuOpen(false);
  };

  const displayName = useMemo(() => {
    if (auth.name)
      return auth.name.length > 18 ? auth.name.slice(0, 18) + "…" : auth.name;
    return "User";
  }, [auth.name]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* Top bar */}
        <div className="w-full bg-black border-b border-gray-800">
          <div className="container mx-auto flex justify-between items-center px-4 md:px-6 py-3">
            <Link to="/" className="flex flex-col leading-tight pt-10 md:pt-12">
              <span className="text-lg md:text-xl font-semibold text-white tracking-wide">
                Vikramshila Automobiles
              </span>
              <span className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-widest">
                Driven by Trust. Delivered with Pride
              </span>

              {/* GREETING — shows for customer logins (non-admin) */}
              {auth.loggedIn && !auth.isAdmin && auth.name && (
                <span className="mt-1 text-[11px] md:text-sm text-blue-300">
                  Welcome Mr.{" "}
                  <span className="font-semibold">
                    {getFirstName(auth.name)}
                  </span>{" "}
                  to Virtual showroom of Vikramshila Automobiles.
                </span>
              )}
            </Link>

            <div className="flex flex-col items-end">
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

                <Link
                  to="/book-service"
                  className="flex items-center gap-2 px-2 py-1 text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span>Book Your Service</span>
                </Link>

                {/* AUTH AREA (click-to-open dropdowns) */}
                {/* AUTH AREA (click-to-open dropdowns) */}
                {!auth.loggedIn ? (
                  <div className="relative" ref={loginMenuRef}>
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-4 py-2 rounded-lg shadow"
                      aria-expanded={loginMenuOpen}
                      onClick={() => setLoginMenuOpen((o) => !o)}
                    >
                      Login
                    </Button>

                    {loginMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-800 bg-[#0f1113] shadow-xl overflow-hidden">
                        <button
                          onClick={() => {
                            window.open(ADMIN_URL, "_blank", "noopener");
                            setLoginMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                        >
                          Login as Admin
                        </button>
                        <button
                          onClick={() => {
                            setAuthModalOpen(true);
                            setLoginMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                        >
                          Login as User
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative" ref={userMenuRef}>
                    <Button
                      className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg shadow flex items-center gap-2"
                      aria-expanded={userMenuOpen}
                      onClick={() => setUserMenuOpen((o) => !o)}
                    >
                      <UserCircle2 className="h-4 w-4" />
                      <span className="max-w-[160px] truncate">
                        {displayName}
                      </span>
                    </Button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-800 bg-[#0f1113] shadow-xl overflow-hidden">
                        {auth.isAdmin && (
                          <button
                            onClick={() =>
                              window.open(ADMIN_URL, "_blank", "noopener")
                            }
                            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                          >
                            Open Admin
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-gray-800 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

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

        {/* Main nav */}
        <div className="w-full bg-[#1a1d20]">
          <div className="container mx-auto flex items-center justify-between h-14 px-4">
            <nav className="hidden md:flex items-center space-x-1">
              {nav.map((item) => {
                const isNew = item.to === "/new-launches";
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "px-4 py-2 text-sm font-medium rounded transition-colors",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800",
                        isNew ? "ring-1 ring-blue-500/30" : "",
                      ].join(" ")
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.label}
                      {isNew && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
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

            {/* Mobile menu unchanged */}
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

              {/* ✅ UPDATED MOBILE MENU */}
              <SheetContent
                side="right"
                className="w-[300px] bg-black text-white p-0"
              >
                <div className="mt-2 h-[calc(100vh-1rem)] overflow-y-auto px-4 py-6 space-y-4">
                  {/* Nav items */}
                  <div className="space-y-2">
                    {nav.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>

                  <div className="my-2 h-px bg-white/10" />

                  {/* Quick actions */}
                  <div className="space-y-2">
                    <Link
                      to="/truck-finder"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-white text-black hover:bg-gray-200 text-sm px-4 py-2 rounded-lg shadow"
                    >
                      Book Your Vehicle
                    </Link>

                    <Link
                      to="/book-service"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
                    >
                      Book Your Service
                    </Link>

                    <Button
                      onClick={() => {
                        openEnquiryDialog("Enquire Now");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Enquire Now
                    </Button>
                  </div>

                  <div className="my-2 h-px bg-white/10" />

                  {/* Contact */}
                  <div className="space-y-2 text-sm">
                    <a
                      href="tel:18002097979"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      <Phone className="h-4 w-4" /> 1800 209 7979
                    </a>
                    <a
                      href="tel:+918406991610"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      <Phone className="h-4 w-4" /> +91 8406991610
                    </a>
                    <a
                      href="https://wa.me/918406991610"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-green-400 hover:text-green-500 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </div>

                  <div className="my-2 h-px bg-white/10" />

                  {/* Auth actions */}
                  {!auth.loggedIn ? (
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                        onClick={() => {
                          setAuthModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login as User
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-sm"
                        onClick={() => {
                          window.open(ADMIN_URL, "_blank", "noopener");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login as Admin
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-300">
                        <UserCircle2 className="h-4 w-4" />
                        <span className="truncate">{displayName}</span>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full text-sm"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* User login/register modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
      />

      <EnquiryDialog />
    </>
  );
}
