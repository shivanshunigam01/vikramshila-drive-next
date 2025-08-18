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

export default function Index() {
  return (
    <div>
      <Helmet>
        <title>Vikramshila Automobiles | Tata Commercial Vehicles Dealer</title>
        <meta
          name="description"
          content="Explore Tata commercial vehicles, book test drives, finance, offers at Vikramshila Automobiles."
        />
        <link rel="canonical" href="/" />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <div className="sr-fade">
          <ProductDisplay />
        </div>

        <div className="sr-fade">
          <LaunchSection />
        </div>

        <div className="sr-fade">
          <FinanceCalculator />
        </div>
        <div className="sr-slide">
          <VideoCarousel />
        </div>

        <div className="sr-fade">
          <OffersSlider />
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
