import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import VehicleDetails from "./pages/VehicleDetails";
import About from "./pages/About";
import ServicesPage from "./pages/ServicesPage";
import FinancePage from "./pages/FinancePage";
import OffersPage from "./pages/OffersPage";
import VideosPage from "./pages/VideosPage";
import ContactPage from "./components/home/ContactPage";
import NewLaunches from "./pages/NewLaunches";
import ScrollToTop from "./components/common/ScrollToTop";
import BookService from "./pages/BookService";
import FinanceDocuments from "./pages/FinanceDocuments";
import AuthModal from "./components/auth/AuthModal";
import AceEvPage from "./pages/AceEvPage";
import TruckFinder from "./components/home/TruckFinder";
import { FilterProvider } from "./contexts/FilterContext";
import FinanceCalculator from "./components/home/FinanceCalculator";
import Review from "./components/home/Review";
import ProductComparison from "./pages/ProductComparision";
import ThankYou from "./pages/ThankYou";
import CancellationRefunds from "./pages/CancellationRefunds";
import TermsConditions from "./pages/TermsConditions";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import { loadRazorpay } from "./lib/loadRazorpay";
import ProductComparison4 from "./pages/ProductComparison4";
import Blogs from "./components/home/blogs";
import FAQPage from "./components/home/Faq";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    loadRazorpay().catch(console.error);
  }, []);
  // Check login status whenever route changes
  useEffect(() => {
    const openAuth = () => setAuthOpen(true);

    window.addEventListener("OPEN_AUTH_MODAL", openAuth);

    return () => {
      window.removeEventListener("OPEN_AUTH_MODAL", openAuth);
    };
  }, []);
  return (
    <>
      <FilterProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<VehicleDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/new-launches" element={<NewLaunches />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/book-service" element={<BookService />} />
          <Route path="/finance-documents" element={<FinanceDocuments />} />
          <Route path="/ace-ev" element={<AceEvPage />} />
          <Route path="/truck-finder" element={<TruckFinder />} />
          <Route path="/review" element={<Review />} />
          <Route path="/compare/:productIds" element={<ProductComparison />} />
          <Route path="/compare4" element={<ProductComparison4 />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route
            path="/cancellation-refunds"
            element={<CancellationRefunds />}
          />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/privacy-policy" element={<Privacy />} />

          <Route
            path="/finance-calculator/:id"
            element={<FinanceCalculator />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Always check login before allowing use */}
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={() => {
            setAuthOpen(false);
          }}
        />
      </FilterProvider>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
