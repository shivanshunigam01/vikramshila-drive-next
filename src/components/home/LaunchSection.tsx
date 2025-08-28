import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import aceProImg from "@/assets/vehicle.png"; // vehicle front image
import aceLogo from "@/assets/acepro.png"; // ace logo image (the white "ACE pro")

export default function LaunchSection() {
  return (
    <section className="w-full bg-[#333333] py-20">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-16">
        {/* Vehicle Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={aceProImg}
            alt="Ace Pro Vehicle"
            className="max-w-sm lg:max-w-lg object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Logo */}
          <div className="mb-8">
            <img
              src={aceLogo}
              alt="Ace Pro Logo"
              className="h-24 lg:h-32 object-contain"
            />
          </div>

          {/* Tagline */}
          <p className="text-white text-2xl lg:text-3xl font-semibold leading-snug mb-10">
            Step into the future of last-mile delivery with the{" "}
            <span className="font-bold">Ace Pro</span>
          </p>
        </div>
      </div>
    </section>
  );
}
