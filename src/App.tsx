import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import VehicleDetails from "./pages/VehicleDetails";
import SimplePage from "./pages/_SimplePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<VehicleDetails />} />
            <Route path="/about" element={<SimplePage title="About Us" description="Know more about Vikramshila Automobiles, our team and values." />} />
            <Route path="/services" element={<SimplePage title="Services" description="Genuine parts, service, assistance and fleet telematics." />} />
            <Route path="/finance" element={<SimplePage title="Finance" description="Flexible finance options tailored to your business." />} />
            <Route path="/offers" element={<SimplePage title="Offers" description="Explore our current schemes and seasonal offers." />} />
            <Route path="/videos" element={<SimplePage title="Videos" description="Watch product walkthroughs, testimonials and more." />} />
            <Route path="/contact" element={<SimplePage title="Contact" description="Reach us via phone, email or WhatsApp. We're here to help." />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
