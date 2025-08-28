import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingVehicleBannerProps {
  imageUrl: string;
  label: string;
  subLabel?: string;
}

const FloatingVehicleBanner: React.FC<FloatingVehicleBannerProps> = ({
  imageUrl,
  label,
  subLabel = "NEW LAUNCH",
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);
  const [maxScroll, setMaxScroll] = useState<number>(3000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);

      const updateMaxScroll = () => {
        setMaxScroll(
          document.documentElement.scrollHeight - window.innerHeight
        );
      };

      updateMaxScroll();

      const handleScroll = () => {
        const currentScroll = window.scrollY;
        setScrollPosition(currentScroll);
        // Show content after vehicle has appeared and moved a bit
        if (currentScroll > 200) setShowContent(true);
      };

      window.addEventListener("resize", updateMaxScroll);
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("resize", updateMaxScroll);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  if (viewportWidth === null) return null;

  // --- News ticker animation logic ---
  const startRight = viewportWidth + 300; // start offscreen right
  const visibleRight = 20; // visible stopping point
  const exitLeft = -400; // exit point (offscreen left)

  const scrollFactor = 0.5;
  const tickerSpeed = 1.5; // speed for ticker movement

  // Scroll points for different phases
  const stopScrollPoint = (startRight - visibleRight) / scrollFactor;
  const pauseDuration = 500; // how long to pause in pixels of scroll
  const exitStartPoint = stopScrollPoint + pauseDuration;

  let rightPosition: number;

  if (scrollPosition <= stopScrollPoint) {
    // Phase 1: Enter from right
    rightPosition = startRight - scrollPosition * scrollFactor;
  } else if (scrollPosition <= exitStartPoint) {
    // Phase 2: Pause at visible position
    rightPosition = visibleRight;
  } else {
    // Phase 3: Exit to left (like news ticker)
    const exitScroll = scrollPosition - exitStartPoint;
    rightPosition = visibleRight - exitScroll * tickerSpeed;
  }

  // Hide banner when it's completely off screen
  const bannerVisible = rightPosition > exitLeft && scrollPosition <= maxScroll;

  return (
    <AnimatePresence>
      {bannerVisible && (
        <motion.div
          className="fixed bottom-6 z-50 flex items-stretch shadow-lg rounded overflow-visible"
          style={{ right: `${rightPosition}px` }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
        >
          {/* Content appears first - Blue and White sections */}
          <AnimatePresence>
            {showContent && (
              <>
                {/* Blue Section */}
                <motion.div
                  className="bg-blue-500 text-white px-4 flex items-center h-16 rounded-l"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 70 }}
                >
                  <span className="font-bold text-sm uppercase whitespace-nowrap">
                    {subLabel}
                  </span>
                </motion.div>

                {/* White Section with Arrow */}
                <motion.div
                  className="bg-white flex items-center px-4 border border-l-0 border-gray-300 h-16"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 70 }}
                >
                  <span className="font-bold text-lg whitespace-nowrap mr-4">
                    {label}
                  </span>

                  {/* Arrow */}
                  <motion.svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-blue-500"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 70 }}
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Vehicle Image appears last - positioned after the labels */}
          <motion.div
            className="flex items-center bg-transparent ml-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <img
              src={imageUrl}
              alt={label}
              className="h-16 w-24 object-contain transform -scale-x-100"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingVehicleBanner;
