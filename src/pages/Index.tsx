import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import ProductGrid from "@/components/home/ProductGrid";
import FinanceCalculator from "@/components/home/FinanceCalculator";
import VideoCarousel from "@/components/home/VideoCarousel";
import OffersSlider from "@/components/home/OffersSlider";
import Services from "@/components/home/Services";
import Footer from "@/components/layout/Footer";
import FloatingCTAs from "@/components/common/FloatingCTAs";
import ScrollRevealer from "@/components/common/ScrollRevealer";
import { Helmet } from "react-helmet-async";
import BusinessServices from "@/components/home/BusinessServices";
import TruckFinder from "@/components/home/TruckFinder";
import NewLaunches from "./NewLaunches";
import ProductDisplay from "@/components/home/ProductDisplay";
import LaunchSection from "@/components/home/LaunchSection";
import EnquireNow from "@/components/home/EnquireNow";
import scrollImage from "@/assets/new-launch.png";
import FloatingVehicleBanner from "@/components/home/FloatingVehicleBanner";
import CibilCheckWidget from "@/components/home/CibilCheckWidget";
import { useEffect, useRef } from "react";
import { trackVisit } from "@/services/visitor.service";

export default function Index() {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;

    const hasTracked = sessionStorage.getItem("vikramshila_visit");

    if (!hasTracked) {
      trackVisit("/");
      sessionStorage.setItem("vikramshila_visit", "true");
      trackedRef.current = true;
    }
  }, []);
  return (
    <div>
      <Helmet>
        <title>
          Vikramshila Automobiles | Tata Motors Commercial Vehicle Dealer in
          Bihar
        </title>
        <meta
          name="description"
          content="Official Tata Motors commercial vehicle dealership in Bihar. Explore Tata Intra, Ace Gold, Yodha, Magic, Winger and full bus range. Book test drive, check EMI offers & apply for finance at Vikramshila Automobiles."
        />
        <link rel="canonical" href="https://vikramshilaautomobiles.com/" />

        {/* OG + Twitter */}
        <meta
          property="og:title"
          content="Vikramshila Automobiles | Tata Motors Commercial Vehicle Dealer in Bihar"
        />
        <meta
          property="og:description"
          content="Explore Tata Motors commercial vehicles, compare models & book test drive with Vikramshila Automobiles."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vikramshilaautomobiles.com/" />
        <meta property="og:image" content="/og-banner.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Vikramshila Automobiles | Tata Motors Dealer"
        />
        <meta
          name="twitter:description"
          content="Tata Motors commercial vehicles dealer in Bihar. Intra, Ace Gold, Yodha, buses & more."
        />
        <meta name="twitter:image" content="/og-banner.jpg" />
      </Helmet>
      <Header />

      {/* Floating Banner */}
      <FloatingVehicleBanner
        imageUrl={scrollImage} // use the imported image here
        label="New Launch: Tata ACE Pro"
      />
      <main>
        <Hero />
        <div className="sr-fade">
          <ProductDisplay />
        </div>

        <div className="sr-fade">
          <LaunchSection />
        </div>

        <div className="sr-fade">
          <OffersSlider />
        </div>

        <div className="sr-fade">
          <FinanceCalculator />
        </div>
        <div className="sr-fade">
          <CibilCheckWidget />
        </div>
        <div className="sr-slide">
          <VideoCarousel />
        </div>

        <div className="sr-fade">
          <TruckFinder />
        </div>
        {/* <div className="sr-fade">
          <Services />
        </div> */}
        <div className="sr-fade">
          <BusinessServices />
        </div>
        <div className="sr-fade">
          <EnquireNow />
        </div>
      </main>
      <Footer />
      <FloatingCTAs />
      <ScrollRevealer />
    </div>
  );
}
